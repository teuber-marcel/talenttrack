import React, { useEffect, useState } from 'react';
import '../../../app/globals.css';
import { Layout, Row, Col, Button, Input, message } from 'antd';
import { CloseCircleOutlined, PlayCircleOutlined, SaveOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Sidebar from '../../../components/Global/Sidebar.jsx';
import EditRadioButtonGroup from '../../../components/EditVacancy/EditRadioButtonGroup.jsx';
import EditCheckboxGroup from '../../../components/EditVacancy/EditCheckboxGroup.jsx';
import EditVacancyTitleInput from '../../../components/EditVacancy/EditVacancyTitleInput.jsx';
import { getVacancyById } from '../../../services/vacancyService.js';

const { Header, Content } = Layout;
const { TextArea } = Input;

const EditVacancy = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedHierarchies, setSelectedHierarchies] = useState([]);
    const [vacancyTitle, setVacancyTitle] = useState("");
    const [createdVacancy, setCreatedVacancy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [other, setOther] = useState("");
  
    const router = useRouter();
    const { id } = router.query;

    // Vacancy aktualisieren (PATCH /api/vacancies/:id/details)
    const handleUpdateVacancy = async () => {
        if (!createdVacancy || !createdVacancy._id) {
            message.error("No vacancy selected for update.");
            return;
        }
    
        // Falls sich nichts geändert hat -> API-Call vermeiden
        if (
            vacancyTitle === createdVacancy.title &&
            selectedDepartment === createdVacancy.department &&
            JSON.stringify(selectedHierarchies) === JSON.stringify(Array.isArray(createdVacancy.hierarchy) ? createdVacancy.hierarchy : [createdVacancy.hierarchy]) &&
            description === createdVacancy.description &&
            requirements === createdVacancy.requirements &&
            other === createdVacancy.other
        ) {
            message.info("No changes detected.");
            return;
        }
    
        const updatedFields = { 
            title: vacancyTitle,
            department: selectedDepartment,
            hierarchy: selectedHierarchies[0] || createdVacancy.hierarchy,
            description, 
            requirements, 
            other 
        };
    
        console.log("📤 Sending PATCH Request to API:", `/api/vacancies/${createdVacancy._id}/details`);
        console.log("📦 Data sent:", JSON.stringify(updatedFields, null, 2));
    
        try {
            const response = await fetch(`/api/vacancies/${createdVacancy._id}/details`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFields),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update vacancy');
            }
    
            message.success("Vacancy updated successfully!");
            router.push('/VacanciesOverview');
    
        } catch (error) {
            console.error("❌ Error updating vacancy:", error);
            message.error(`Error updating vacancy: ${error.message}`);
        }
    };    

    useEffect(() => {
        if (id) {
            const fetchVacancy = async () => {
                try {
                    const data = await getVacancyById(id);
                    if (!data || Object.keys(data).length === 0) {
                        message.error("Fehler beim Laden der Vacancy");
                        return;
                    }
    
                    setCreatedVacancy(data);
                    setVacancyTitle(data.title || "");
                    setSelectedDepartment(data.department || "");
                    setSelectedHierarchies(Array.isArray(data.hierarchy) ? data.hierarchy : [data.hierarchy]);
                    setDescription(data.description || "");
                    setRequirements(data.requirements || "");
                    setOther(data.other || "");
                } catch (error) {
                    message.error("Fehler beim Laden der Vacancy");
                }
            };
            fetchVacancy();
        }
    }, [id]);

    return (
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.3s ease", backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <Layout style={{ background: 'var(--background)' }}>  
                <Header style={{ color: 'white', background: 'var(--background)', padding: 0, textAlign: 'center', fontSize: '24px' }}>
                    Edit Vacancy
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div style={{ padding: 16, minHeight: 240, background: '#333', borderRadius: 8, color: 'white', display: 'flex', justifyContent: 'center' }}>
                                <EditRadioButtonGroup onChange={setSelectedDepartment} value={selectedDepartment} />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ padding: 16, minHeight: 240, background: '#333', borderRadius: 8, color: 'white', display: 'flex', justifyContent: 'center' }}>
                                <EditCheckboxGroup onChange={setSelectedHierarchies} value={selectedHierarchies} />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{ padding: 16, minHeight: 140, background: '#333', borderRadius: 8, color: 'white' }}>
                                <EditVacancyTitleInput onChange={setVacancyTitle} value={vacancyTitle} />
                            </div>
                        </Col>

                        <Col span={24}>
                            <div style={{ background: '#333', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                                <h3 style={{ color: 'white', marginBottom: '8px' }}>Description</h3>
                                <TextArea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    autoSize={{ minRows: 3 }}
                                    style={{ background: '#222', color: 'white', border: 'none', marginBottom: '12px' }}
                                />

                                <h3 style={{ color: 'white', marginBottom: '8px' }}>Requirements</h3>
                                <TextArea
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    autoSize={{ minRows: 3 }}
                                    style={{ background: '#222', color: 'white', border: 'none' }}
                                />
            
                                <h3 style={{ color: 'white', marginBottom: '8px' }}>Other</h3>
                                <TextArea
                                    value={other}
                                    onChange={(e) => setOther(e.target.value)}
                                    autoSize={{ minRows: 3 }}
                                    style={{ background: '#222', color: 'white', border: 'none' }}
                                />
                            </div>
                        </Col>

                        <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
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
                                icon={<CloudUploadOutlined />} 
                                size="large"
                                disabled={
                                    createdVacancy &&
                                    vacancyTitle === createdVacancy.title &&
                                    selectedDepartment === createdVacancy.department &&
                                    JSON.stringify(selectedHierarchies) === JSON.stringify(Array.isArray(createdVacancy.hierarchy) ? createdVacancy.hierarchy : [createdVacancy.hierarchy]) &&
                                    description === createdVacancy.description &&
                                    requirements === createdVacancy.requirements &&
                                    other === createdVacancy.other
                                } 
                                onClick={() => handleUpdateVacancy()}
                            >
                                Update Vacancy
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default EditVacancy;