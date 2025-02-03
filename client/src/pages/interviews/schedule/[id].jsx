import React, { useState, useEffect } from "react";
import "../../../app/globals.css";
import {
  Layout,
  Row,
  Col,
  Button,
  Calendar,
  TimePicker,
  Typography,
  message,
  Card,
} from "antd";
import { CloseCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Sidebar from "../../../components/Global/Sidebar.jsx";
import ProgressStepper from "../../../components/Global/ProgressStepper";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

const { Content } = Layout;
const { Title } = Typography;

// Example steps array
const steps = [
  { title: "Vacancy", status: "finish" },
  { title: "Applicant", status: "finish" },
  { title: "Interview", status: "finish" },
];

// A unified card style (like your other pages)
const cardStyle = {
  background: "#fff",
  border: "1px solid #d9d9d9",
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  padding: 24,
};

const ScheduleInterview = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  const [timeRange, setTimeRange] = useState(null);
  const [applicantId, setApplicantId] = useState(null);

  const router = useRouter();

  // Once router is ready, set the applicantId from the URL (e.g., ?id=xxx)
  useEffect(() => {
    if (router.isReady) {
      setApplicantId(router.query.id || null);
    }
  }, [router.isReady, router.query.id]);

  // Disable past days in the calendar
  const disabledDate = (current) => current && current.isBefore(dayjs(), "day");

  // Allow only 08:00 - 18:00 in 15-min increments
  const disabledTime = () => ({
    disabledHours: () => [
      ...Array(8).keys(), // 0-7
      ...Array.from({ length: 6 }, (_, i) => 18 + i), // 18-23
    ],
    disabledMinutes: () =>
      Array.from({ length: 60 }, (_, i) => (i % 15 !== 0 ? i : null)).filter(
        Boolean
      ),
  });

  const handleScheduleInterview = async () => {
    if (!applicantId) {
      message.error("Missing Applicant ID in the URL!");
      return;
    }

    if (!selectedDate || !timeRange || !timeRange[0] || !timeRange[1]) {
      message.error("Please select a date and valid time range!");
      return;
    }

    const [startTime, endTime] = timeRange;
    if (startTime.isSameOrAfter(endTime)) {
      message.error("Start time must be before end time!");
      return;
    }

    // Build interview payload
    const interviewData = {
      interviewStartDate: selectedDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .toISOString(),
      interviewEndDate: selectedDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .toISOString(),
      applicant: applicantId,
    };

    console.log("📤 Sending to API:", interviewData);

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) throw new Error("Error saving the interview.");

      message.success("Interview successfully scheduled!");
      router.back(); // Return to previous page
    } catch (error) {
      console.error("❌ Error saving:", error);
      message.error("Error scheduling the interview.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content style={{ padding: 24, background: "#f0f2f5" }}>
          {/* Title + Stepper */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Schedule Interview
              </Title>
            </Col>
            <Col style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 300, paddingBottom: 4 }}>
                <ProgressStepper steps={steps} currentStep={2} />
              </div>
            </Col>
          </Row>

          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              {/* Main Card */}
              <Card style={cardStyle}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  Select Date and Time
                </Title>
                {/* Calendar */}
                <Calendar
                  fullscreen={false}
                  value={selectedDate}
                  onSelect={(date) =>
                    setSelectedDate(dayjs(date).startOf("day"))
                  }
                  disabledDate={disabledDate}
                  style={{
                    marginBottom: 24,
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                  }}
                />
                {/* TimePicker */}
                <TimePicker.RangePicker
                  format="HH:mm"
                  minuteStep={15}
                  value={timeRange}
                  onChange={setTimeRange}
                  disabledTime={disabledTime}
                  style={{ width: "100%", marginBottom: 24 }}
                  placeholder={["Start Time", "End Time"]}
                />

                {/* Action Buttons */}
                <Row justify="space-between">
                  <Button
                    type="default"
                    icon={<CloseCircleOutlined />}
                    size="large"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    size="large"
                    onClick={handleScheduleInterview}
                  >
                    Schedule Interview
                  </Button>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ScheduleInterview;
