import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SubjectCard = (props) => {
    const [name, setName] = useState(props.subjectName);

    const [showSubject, setShowSubject] = useState(false);
    const handleSubjectClose = () => setShowSubject(false);
    const handleSubjectShow = () => setShowSubject(true);

    const changeNameHandler = (event) => {
        setName(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        axios.put(`http://localhost:8080/subject?subject_id=${props.sId}`, {
            name: name
        });

        props.updateHandler(!props.update);
        props.updateTostify();

        setName('');
    };

    const handleDeleteSubject = () => {
        axios.delete(`http://localhost:8080/subject?subject_id=${props.sId}`);
        props.updateHandler();
        props.deleteTostify();
    };

    const chapterLength = props.chaptersData.length ? 0 : props.chaptersData.length;

    return (
        <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
            <Card.Header>{props.subjectName}</Card.Header>
            <Card.Body>
                <Card.Subtitle className='mb-2 text-muted'>{chapterLength} Topics</Card.Subtitle>
                <Link to={`/subject/chapters/${props.sId}`}>
                    <Button variant='primary'>Go To Chapters</Button>
                </Link>
                <div
                    style={{
                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <FaPen color='orange' onClick={handleSubjectShow} cursor='pointer' />
                    <MdDelete color='red' cursor='pointer' onClick={handleDeleteSubject} />
                </div>
                <Modal show={showSubject} onHide={handleSubjectClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Subject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Subject Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={name}
                                    onChange={changeNameHandler}
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

export default SubjectCard;
