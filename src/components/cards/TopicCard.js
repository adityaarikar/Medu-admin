import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

const TopicCard = (props) => {
    const [name, setName] = useState(props.title);
    const [pdfLink, setPdfLink] = useState(props.pdfLink);
    const [videoLink, setVideoLink] = useState(props.videoLink);
    // const []

    const changeNameHandler = (event) => {
        setName(event.target.value);
    };

    const changePdfHandler = (event) => {
        setPdfLink(event.target.value);
    };

    const changeVideoHandler = (event) => {
        setVideoLink(event.target.value);
    };

    const [showtopic, setShowTopic] = useState(false);
    const handleTopicClose = () => setShowTopic(false);
    const handleTopicShow = () => setShowTopic(true);

    const onDeleteTopic = () => {
        axios.delete(`http://localhost:8080/topic?topic_id=${props.tId}`);
        props.updateHandler(props.update);
        props.deleteTostify();
    };

    const submitHandler = () => {
        return '';
    };

    return (
        <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
            <Card.Header>{props.title}</Card.Header>
            <Card.Body>
                <Card.Title>Subject : {props.subjectName}</Card.Title>
                <Card.Title>Chapter : {props.chapterName}</Card.Title>
                <div
                    style={{
                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <Button className='mr-3' variant='primary'>
                        Pdf Link
                    </Button>
                    <Button variant='primary'>Video Link</Button>
                </div>
                <div
                    style={{
                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <FaPen color='orange' onClick={handleTopicShow} cursor='pointer' />
                    <MdDelete color='red' cursor='pointer' onClick={onDeleteTopic} />
                </div>
                <Modal show={showtopic} onHide={handleTopicClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Topic</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Topic Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={name}
                                    onChange={changeNameHandler}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={videoLink}
                                    onChange={changeVideoHandler}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>PDF Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={pdfLink}
                                    onChange={changePdfHandler}
                                    required
                                />
                            </Form.Group>
                            <Button variant='primary' type='submit' onSubmit={submitHandler}>
                                Edit Subject
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default TopicCard;
