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
import TopicLoading from 'components/loading/TopicLoading';
import constants from '../../constants';

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

const Topics = () => {
    const classes = useStyles();
    const [topics, setTopics] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);

    const [enteredName, setName] = useState('');
    const [pdfLink, setPdfLink] = useState('');
    const [englishVideoLink, setEnglishVideoLink] = useState('');
    const [hindiVideoLink, setHindiVideoLink] = useState('');
    const [selectSubject, setSelectSubject] = useState('');

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const [update, setUpdate] = useState(false);

    const topicNameChangeHandler = (event) => {
        setName(event.target.value);
    };

    const linkChangeHandler = (event) => {
        setEnglishVideoLink(event.target.value);
    };

    const hindiLinkChangeHandler = (event) => {
        setHindiVideoLink(event.target.value);
    };

    const subjectChangeHandler = (event) => {
        setSelectSubject(event.target.value);
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

    const postData = async () => {
        try {
            await axios.post(`${constants.url}topic?chapter_id=${selectSubject}`, {
                name: enteredName,
                pdfLink: pdfLink,
                englishVideoLink: englishVideoLink,
                hindiVideoLink: hindiVideoLink
            });
            setUpdate(!update);
        } catch (error) {
            console.error(error);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        postData();
        setName('');
        setEnglishVideoLink('');
        setSelectSubject('');
        setHindiVideoLink('');
        setFile('');
        setProgress(0);
        setShowAdd(false);
    };

    useEffect(() => {
        const getTopics = async () => {
            const response = await axios.get(`${constants.url}topics`);

            setTopics(response.data);
            setIsLoading(false);
        };
        axios.get(`${constants.url}chapters`).then((response) => {
            setChapters(response.data);
        });

        getTopics();
    }, [update]);

    const RenderTopics = ({ topics, isLoading }) => {
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
                {topics.length === 0 ? (
                    <>No topics are added...</>
                ) : (
                    topics.map((data) => {
                        return (
                            <TopicCard
                                tId={data.tId}
                                title={data.name}
                                subjectName={data.subjectName}
                                chapterName={data.chapterName}
                                videoLink={data.englishVideoLink}
                                hindiVideoLink={data.hindiVideoLink}
                                pdfLink={data.pdfLink}
                                update={update}
                                setUpdate={setUpdate}
                                updateTostify={updateNotify}
                                deleteTostify={deleteNotify}
                            />
                        );
                    })
                )}
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
                <h1 className={classes.titleHeading}>Topics</h1>

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

                <Button variant='primary' onClick={() => setShowAdd(true)}>
                    Add New Topic
                </Button>

                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
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
                            <Form.Group controlId='form.subject' className='mb-3'>
                                <Form.Label>Chapter</Form.Label>
                                <Form.Select
                                    aria-label='Default select example'
                                    onChange={subjectChangeHandler}
                                    required
                                >
                                    <option value=''>Select Chapter</option>
                                    {chapters.map((data) => {
                                        return (
                                            <option key={data.cId} value={data.cId}>
                                                {data.chapterName}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId='form.hindiLink' className='mb-3'>
                                <Form.Label>Hindi Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={hindiVideoLink}
                                    onChange={hindiLinkChangeHandler}
                                    placeholder='Enter hindi video link'
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.englishLink' className='mb-3'>
                                <Form.Label>English Video Link</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={englishVideoLink}
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

export default Topics;
