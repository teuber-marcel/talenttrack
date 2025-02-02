import React, { useState, useEffect } from 'react';
import '../../../app/globals.css';
import { Layout, Row, Col, Button, Calendar, TimePicker, message } from 'antd';
import { CloseCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Sidebar from '../../../components/Global/Sidebar.jsx';

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

const { Header, Content } = Layout;

const ScheduleInterview = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('day')); 
    const [timeRange, setTimeRange] = useState(null);
    const [applicantId, setApplicantId] = useState(null); // ✅ Explizite State-Variable für die ID

    const router = useRouter();

    // ✅ Warte, bis `router.isReady` ist, um die ID sicher zu setzen
    useEffect(() => {
        if (router.isReady) {
            setApplicantId(router.query.id || null);
        }
    }, [router.isReady, router.query.id]);

    // Keine vergangenen Tage wählbar
    const disabledDate = (current) => current && current.isBefore(dayjs(), 'day');

    // Zeitbereich nur zwischen 08:00 - 18:00 Uhr
    const disabledTime = () => ({
        disabledHours: () => [...Array(8).keys(), ...Array.from({ length: 6 }, (_, i) => 18 + i)],
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i % 15 !== 0 ? i : null).filter(Boolean),
    });

    // ✅ Speicherung des Interviews mit Fixes
    const handleScheduleInterview = async () => {
        if (!applicantId) {  
            message.error("Fehlende Applicant-ID in der URL!"); 
            return;
        }

        if (!selectedDate || !timeRange || !timeRange[0] || !timeRange[1]) {
            message.error("Bitte ein Datum und eine gültige Zeit auswählen!");
            return;
        }

        const [startTime, endTime] = timeRange;
        if (startTime.isSameOrAfter(endTime)) {
            message.error("Die Startzeit muss vor der Endzeit liegen!");
            return;
        }

        const interviewData = {
            interviewStartDate: selectedDate.hour(startTime.hour()).minute(startTime.minute()).toISOString(),
            interviewEndDate: selectedDate.hour(endTime.hour()).minute(endTime.minute()).toISOString(),
            applicant: applicantId,
        };

        console.log("📤 Sende an API:", interviewData);

        try {
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(interviewData),
            });

            if (!response.ok) throw new Error('Fehler beim Speichern des Interviews.');

            message.success("Interview erfolgreich geplant!");
            router.back();
        } catch (error) {
            console.error("❌ Fehler beim Speichern:", error);
            message.error("Fehler beim Speichern des Interviews.");
        }
    };

    return (
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.3s ease", backgroundColor: 'var(--background)', minHeight: '100vh', height: '100%', display: 'flex' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout style={{ background: 'var(--background)' }}>
                <Header style={{ color: 'white', background: 'var(--background)', padding: 0, textAlign: 'center', fontSize: '24px' }}>
                    Schedule Interview
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Row gutter={[16, 16]}>
                        {/* 📅 Kalender */}
                        <Col span={12}>
                            <div style={{ padding: 16, minHeight: 455, background: '#333', borderRadius: 8, color: 'white', display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                                <h3 style={{ color: 'white', marginBottom: '8px' }}>Select Date and Time of the Interview</h3>
                                <Calendar 
                                    fullscreen={false} 
                                    value={selectedDate}
                                    onSelect={(date) => setSelectedDate(dayjs(date).startOf('day'))} 
                                    disabledDate={disabledDate} 
                                />
                                
                                {/* Abstand zwischen Kalender und TimePicker */}
                                <div style={{ marginTop: '16px' }}>  
                                    <TimePicker.RangePicker 
                                        format="HH:mm" 
                                        minuteStep={15} 
                                        value={timeRange} 
                                        onChange={setTimeRange} 
                                        disabledTime={disabledTime} 
                                        style={{ width: '100%', background: '#222', color: 'white' }}
                                        placeholder={['Start Time', 'End Time']}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* 🔘 Buttons */}
                    <Row style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="default" icon={<CloseCircleOutlined />} size="large" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="primary" icon={<CalendarOutlined />} size="large" onClick={handleScheduleInterview}>
                            Schedule Interview
                        </Button>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ScheduleInterview;