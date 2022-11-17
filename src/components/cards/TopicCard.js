import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import constants from '../../constants';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const TopicCard = (props) => {
    const [name, setName] = useState(props.title);
    const [pdfLink, setPdfLink] = useState(props.pdfLink);
    const [hindiVideoLink, setHindiVideoLink] = useState(props.hindiVideoLink);
    const [englishVideoLink, setEnglishVideoLink] = useState(props.englishVideoLink);
    const [showtopic, setShowTopic] = useState(false);

    const storage = getStorage();

    const changeNameHandler = (event) => {
        setName(event.target.value);
    };

    const changePdfHandler = (event) => {
        setPdfLink(event.target.value);
    };

    const changeVideoHandler = (event) => {
        setHindiVideoLink(event.target.value);
    };

    const changeHindiVideoHandler = (event) => {
        setEnglishVideoLink(event.target.value);
    };

    const onDeleteTopic = () => {
        const desertRef = ref(storage, props.pdfLink);
        console.log(props.pdfLink);

        // Delete the file
        deleteObject(desertRef)
            .then(() => {
                // File deleted successfully
                axios.delete(`${constants.url}topic?topic_id=${props.tId}`);
                props.setUpdate(!props.update);
                props.deleteTostify();
            })
            .catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
            });
        //2.
        // pictureRef
        //     .delete()
        //     .then(() => {
        //         axios.delete(`${constants.url}topic?topic_id=${props.tId}`);
        //         props.setUpdate(!props.update);
        //         props.deleteTostify();
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
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
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}
                >
                    <Button style={{ margin: '5px' }} className='mr-3' variant='primary'>
                        Pdf Link
                    </Button>
                    <Button style={{ margin: '5px' }} className='mr-3' variant='primary'>
                        Hindi Video Link
                    </Button>
                    <Button style={{ margin: '5px' }} variant='primary'>
                        Video Link
                    </Button>
                </div>
                <div
                    style={{
                        marginTop: '15px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <FaPen color='orange' onClick={() => setShowTopic(true)} cursor='pointer' />
                    <MdDelete color='red' cursor='pointer' onClick={onDeleteTopic} />
                </div>
                <Modal show={showtopic} onHide={() => setShowTopic(false)}>
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
                                <Form.Label>English Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={hindiVideoLink}
                                    onChange={changeVideoHandler}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Hindi Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={englishVideoLink}
                                    onChange={changeHindiVideoHandler}
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
