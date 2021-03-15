import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import 'antd/dist/antd.css'

import { login, getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import { Form, Input, Button } from 'antd';

const Login = (props) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then(res=>{
            history.push("/main")
        });
      }, []);

    const onFinish = (value) => {
        login(value).then(response=>{
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            history.push("/main")
        }).catch(err => {
                alert(err.message);
            }
        );
    }

    return (
        <div className="login-container">
            <h1 className="page-title">Login</h1>
            <div className="login-content">
                <Form form={form} className="login-form" onFinish={onFinish}>
                    <FormItem name="username">
                        <Input 
                            size="large"
                            name="username" 
                            placeholder="Username" />
                    </FormItem>
                    <FormItem name="password">
                        <Input 
                            size="large"
                            name="password" 
                            type="password" 
                            placeholder="Password" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
}

export default Login;