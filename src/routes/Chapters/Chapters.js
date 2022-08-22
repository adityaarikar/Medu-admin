import React, { useEffect, useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChapterCard from 'components/cards/ChapterCard';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChapterLoading from 'components/loading/ChapterLoading';
import constants from '../../constants';

const useStyles = createUseStyles({
    cardsContainer: {
        marginTop: 30
    },
    mainHeader: {
        '@media (min-width: 768px)': {
            marginTop: 20
        }
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    }
});

const Chapters = () => {
    const classes = useStyles();
    const [chapters, setChapters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const [enteredName, setEnteredName] = useState('');
    const [selectSubject, setSelectSubject] = useState();

    const changeNameHandler = (event) => {
        setEnteredName(event.target.value);
    };

    const changeSelectSubjectHandler = (event) => {
        console.log(event);
        setSelectSubject(event.target.value);
    };

    const updateNotify = () => toast('Chapter is updated');

    const deleteNotify = () => toast('Chapter is deleted');

    const postData = async () => {
        try {
            await axios.post(`${constants.url}chapter?subject_id=${selectSubject}`, {
                chapterName: enteredName
            });
            setUpdate(!update);
        } catch (error) {
            console.error(error);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        postData();
        setEnteredName('');
        setShowAdd(false);
    };

    const getChapters = async () => {
        try {
            const response = await axios.get(`${constants.url}chapters`);

            setChapters(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getChapters();
        axios.get(`${constants.url}subject`).then((response) => {
            setSubjects(response.data);
        });
    }, [update]);

    const RenderChapters = ({ chapters, isLoading }) => {
        return isLoading ? (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                <ChapterLoading />
                <ChapterLoading />
                <ChapterLoading />
                <ChapterLoading />
                <ChapterLoading />
                <ChapterLoading />
            </Row>
        ) : (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                {chapters.length === 0 ? (
                    <>No chapters are added...</>
                ) : (
                    chapters.map((data) => {
                        return (
                            <ChapterCard
                                key={data.cId}
                                cId={data.cId}
                                chapterName={data.chapterName}
                                subjectName={data.subjectName}
                                topicData={data.topics}
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
                <h1>Chapters</h1>
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
                <Button className='mb-md-3' variant='primary' onClick={() => setShowAdd(true)}>
                    Add New Chapter
                </Button>

                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Chapter Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={enteredName}
                                    onChange={changeNameHandler}
                                    placeholder='Topic....'
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId='form.subject' className='mb-3'>
                                <Form.Label>Subject Name</Form.Label>
                                <Form.Select
                                    aria-label='Default select example'
                                    onChange={changeSelectSubjectHandler}
                                    required
                                >
                                    <option value=''>Select subject</option>
                                    {subjects.map((data) => {
                                        return (
                                            <option key={data.sId} value={data.sId}>
                                                {data.name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Button variant='primary' type='submit' onSubmit={submitHandler}>
                                Add Chapter
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Row>
            <RenderChapters isLoading={isLoading} chapters={chapters} />
        </Column>
    );
};

export default Chapters;
