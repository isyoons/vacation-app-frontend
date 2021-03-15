import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './Vacation.css';
import { insertVacation, getCurrentUser, getVacation, getUserInfo, deleteVacation } from '../util/APIUtils'
import { Form, Input, Button, Table, List, Card, DatePicker, Select } from 'antd';

const Vacation = () => {
    const [state, setState] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [vacationInfo, setVacationInfo] = useState([]);
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const history = useHistory()
    
    useEffect(() => {
        loading()
      }, []);

    const loading = () => {
        getCurrentUser().then(res=>{
            let promise;

            promise = getUserInfo(res.username) 

            promise            
            .then(response => {
                setUserInfo({
                    ...response
                })
            }).catch(error => {
                console.log(error)
            });
            
            promise = getVacation(res.id)

            promise           
            .then(response => {
                setVacationInfo([
                    ...response
                ]);
                console.log(response)
                //console.log(response)
            }).catch(error => {
                console.log(error)
            });
            //console.log(res)
        }).catch(err =>  {
                alert("로그인 해주십시오.")
                history.push("/")
            }
        );
    }

    const onFinish = (value) => {
        let data = {}
        if(value.vacationGb === "01"){        
            data = {
                ...value,
                startDt : value.dateRange[0].format('YYYYMMDD'),
                endDt : value.dateRange[1].format('YYYYMMDD'),
                userAnnualId: userInfo.id
            }
        }else{
            data = {
                ...value,
                startDt : value.dateRange.format('YYYYMMDD'),
                endDt : value.dateRange.format('YYYYMMDD'),
                userAnnualId: userInfo.id
            }
        }
        insertVacation(data).then(res=>{
            alert("완료")
            loading()
        }).catch(err => 
            alert(err.message)
        );
    }

    const onChangeDate = (dates) => {
        const date1 = dates[0].toDate();
        const date2 = dates[1].toDate();
        let count = 0;
        
        while(true) {
            const temp_date = date1;
            if(temp_date.getTime() > date2.getTime()) {
                break;
            } else {
                const tmp = temp_date.getDay();
                if(tmp !== 0 && tmp !== 6) 
                    count++;
                temp_date.setDate(date1.getDate() + 1); 
            }
        }
        form.setFieldsValue({
            useDays: count,
        });
    }

    const onChangeSelect = (value) => {
        if(value === "01"){
            form.setFieldsValue({
                useDays: 0,
            });
            setState(true);
        }else if(value === "02"){
            form.setFieldsValue({
                useDays: 0.5,
            });
            setState(false);
        }else if(value === "03"){
            form.setFieldsValue({
                useDays: 0.25,
            });
            setState(false);
        }
    }

    const onCancel = (value) => {
        deleteVacation({id : value}).then(res=>{
            alert("완료")
            loading()
        }).catch(err => 
            alert(err.message)
        );
    }

    const columns = [
        {
            title: '순번',
            dataIndex: 'seq',
            key: 'seq',
            render: (text, row, index) => {
                return index + 1
            }
        },
        {
            title: '휴가구분',
            dataIndex: 'vacationGb',
            key: 'vacationGb',
            render: (text, row, index) => {
                if(text === "01"){
                    return "연차"
                }else if(text === "02"){
                    return "반차"
                }else if(text === "03")
                    return "반반차"
            }
        },
        {
            title: '시작일',
            dataIndex: 'startDt',
            key: 'startDt',
        },
        {
            title: '종료일',
            dataIndex: 'endDt',
            key: 'endDt',
        },
        {
            title: '사용일수',
            dataIndex: 'useDays',
            key: 'useDays'
        },
        {
            title: '코멘트',
            dataIndex: 'comment',
            key: 'comment'
        },
        {
            title: '취소',
            dataIndex: 'cancel',
            key: 'cancel',
            render: (text, row, index) => {
                const today = new Date();

                const y = row.startDt.substr(0, 4);
                const m = row.startDt.substr(4, 2);
                const d = row.startDt.substr(6, 2);

                const startDt = new Date(y,Number(m)-1,d)
                if(today.getTime() < startDt.getTime()){
                    return <Button onClick={() => onCancel(row.id)}>취소</Button>
                }
                return "";
            }
        },
    ];

    const userInfoData = [
        {
            title: '아이디',
            data: userInfo.username,
        },
        {
            title: '성명',
            data: userInfo.name,
        },
        {
            title: '전체휴가일수',
            data: userInfo.totalDays,
        },
        {
            title: '사용일수',
            data: userInfo.useDays,
        },
        {
            title: '잔여일수',
            data: userInfo.leftDays,
        },
    ];

    return (
        <div className="vacation-container">
            <h1 className="page-title">휴가신청시스템</h1>
            <div className="vacation-content">
                <h3 className="title">1. 사용자정보</h3>
                <List
                    grid={{ gutter: 0, column: 5 }}
                    dataSource={userInfoData}
                    renderItem={item => (
                    <List.Item>
                        <Card title={item.title}>{item.data}</Card>
                    </List.Item>
                    )}
                />
                <br></br>

                <h3 className="title">2. 휴가신청내역</h3>
                <Table 
                    pagination={{
                    total: 1000,
                    pageSize: 1000,
                    hideOnSinglePage: true
                  }}
                  columns={columns} dataSource={vacationInfo} />
                <br></br>

                <h3 className="title">3. 휴가신청</h3>
                
                <Form className="vacation-form" form={form} onFinish={onFinish} initialValues={{ vacationGb:'01' }}>
                    <FormItem name="vacationGb">
                        <Select style={{ width: 120 }} onChange={onChangeSelect}>
                            <Option value="01">연차</Option>
                            <Option value="02">반차</Option>
                            <Option value="03">반반차</Option>
                        </Select>
                    </FormItem>
                    {
                        state ?
                        <FormItem name="dateRange">
                            <RangePicker placeholder={["시작일","종료일"]} onChange={onChangeDate}/>
                        </FormItem> :
                        <FormItem name="dateRange">
                            <DatePicker placeholder={"시작일"}/>
                        </FormItem>
                    }
                    <FormItem name="useDays">
                    <Input 
                        size="large"
                        name="useDays" 
                        placeholder="사용일수" 
                        readOnly
                    />
                    </FormItem>
                    <FormItem name="comment">
                        <Input 
                            size="large"
                            name="comment"
                            placeholder="코멘트" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" size="large" className="vacation-form-button">신청</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
}

export default Vacation;