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
import constants from '../../constants';

const ChapterCard = (props) => {
    const [name, setName] = useState(props.chapterName);
    const [showChapter, setShowChapter] = useState(false);

    const changeNameHandler = (event) => {
        setName(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        try {
            axios.put(`${constants.url}chapter?chapter_id=${props.cId}`, {
                chapterName: name
            });

            props.setUpdate(!props.update);
            props.updateTostify();
        } catch (error) {
            if (error.responce.status === 404) {
                console.log('Something went wrong...!');
            }
        }

        setName('');
        setShowChapter(false);
    };

    const onDeleteChapter = () => {
        axios.delete(`${constants.url}chapter?chapter_id=${props.cId}`);
        props.setUpdate(!props.update);
        props.deleteTostify();
    };

    return (
        <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
            <Card.Header>{props.chapterName}</Card.Header>
            <Card.Body>
                <Card.Title>Subject : {props.subjectName}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                    {props.topicData.length} Topics
                </Card.Subtitle>
                <Link to={`/chapter/topics/${props.cId}`}>
                    <Button variant='primary'>Go To Topics</Button>
                </Link>
                <div
                    style={{
                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <FaPen color='orange' onClick={() => setShowChapter(true)} cursor='pointer' />
                    <MdDelete color='red' cursor='pointer' onClick={onDeleteChapter} />
                </div>
                <Modal show={showChapter} onHide={() => setShowChapter(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Chapter Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={name}
                                    onChange={changeNameHandler}
                                    required
                                />
                            </Form.Group>
                            <Button variant='primary' type='submit' onSubmit={submitHandler}>
                                Edit Chapter
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default ChapterCard;
