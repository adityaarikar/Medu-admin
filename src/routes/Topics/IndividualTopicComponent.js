import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopicCard from 'components/cards/TopicCard';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { async } from '@firebase/util';
import TopicLoading from 'components/loading/TopicLoading';

const useStyles = createUseStyles({
    cardsContainer: {
        marginTop: 30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {}
    },
    titleHeading: {}
});

const IndividualTopicComponent = (props) => {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const classes = useStyles();
    const [showAdd, setShowAdd] = useState(false);
    const handleAddClose = () => setShowAdd(false);
    const handleAddShow = () => setShowAdd(true);

    const [enteredName, setName] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [pdfLink, setPdfLink] = useState('');

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const [update, setUpdate] = useState(true);

    const updateHandler = () => {
        setUpdate(!update);
    };

    const topicNameChangeHandler = (event) => {
        setName(event.target.value);
    };

    const linkChangeHandler = (event) => {
        setVideoLink(event.target.value);
    };

    const fileChangeHandler = (event) => {
        setFile(event.target.files[0]);
    };

    const updateNotify = () => toast('Chapter is updated');

    const deleteNotify = () => toast('Chapter is deleted');

    const uploadFile = () => {
        if (!file) {
            alert('Please upload a pdf file!');
            return;
        }

        const storageRef = ref(storage, `/pdf/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                // update progress
                setProgress(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setPdfLink(url);
                });
            }
        );
    };

    const submitHandler = (event) => {
        event.preventDefault();

        axios.post(`http://localhost:8080/topic?chapter_id=${props.match.params.id}`, {
            name: enteredName,
            pdfLink: pdfLink,
            videoLink: videoLink
        });

        updateHandler();

        setName('');
        setVideoLink('');
        setFile('');
        setProgress(0);

        handleAddClose();
    };

    useEffect(() => {
        const getTopicData = async () => {
            const responce = await axios.get(
                `http://localhost:8080/topic?chapter_id=${props.match.params.id}`
            );

            setTopics(responce.data);
            setIsLoading(false);
        };

        getTopicData();
    }, [update]);

    const RenderTopics = ({ isLoading, topics }) => {
        return isLoading ? (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                <TopicLoading />
                <TopicLoading />
                <TopicLoading />
                <TopicLoading />
                <TopicLoading />
                <TopicLoading />
            </Row>
        ) : (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                {topics.map((data) => {
                    return (
                        <TopicCard
                            tId={data.tId}
                            title={data.name}
                            subjectName={data.subjectName}
                            chapterName={data.chapterName}
                            videoLink={data.videoLink}
                            pdfLink={data.pdfLink}
                            update={update}
                            updateHandler={updateHandler}
                            updateTostify={updateNotify}
                            deleteTostify={deleteNotify}
                        />
                    );
                })}
            </Row>
        );
    };

    return (
        <Column>
            <Row
                className={classes.mainHeader}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                {/* <h1 className={classes.titleHeading}>{topics[0].chapterName}</h1> */}

                <ToastContainer
                    position='top-right'
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <Button variant='primary' onClick={handleAddShow}>
                    Add New Topic
                </Button>

                <Modal show={showAdd} onHide={handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Topic</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Topic Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={enteredName}
                                    onChange={topicNameChangeHandler}
                                    placeholder='Topic....'
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.link' className='mb-3'>
                                <Form.Label>Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={videoLink}
                                    onChange={linkChangeHandler}
                                    placeholder='Enter video link'
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.file' className='mb-3'>
                                <Form.Label>Upload PDF file</Form.Label>
                                <input type='file' onChange={fileChangeHandler} />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Button className='mt-2' type='button' onClick={uploadFile}>
                                        Upload
                                    </Button>
                                    {progress === 0 ? null : (
                                        <ProgressBar
                                            className='mt-2'
                                            style={{ width: '200px' }}
                                            now={progress}
                                            label={`${progress}%`}
                                        />
                                    )}
                                </div>
                            </Form.Group>
                            <Button variant='primary' type='submit' onSubmit={submitHandler}>
                                Add Topic
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Row>
            <RenderTopics isLoading={isLoading} topics={topics} />
        </Column>
    );
};

export default IndividualTopicComponent;
