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

const IndividualChapterComponent = (props) => {
    const [chapters, setChapters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [update, setUpdate] = useState(true);

    const classes = useStyles();
    const [showAdd, setShowAdd] = useState(false);
    const handleAddClose = () => setShowAdd(false);
    const handleAddShow = () => setShowAdd(true);

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => setShowAlert(!showAlert);

    const [enteredName, setEnteredName] = useState('');

    const changeNameHandler = (event) => {
        setEnteredName(event.target.value);
    };

    const updateHandler = () => {
        setUpdate(!update);
    };

    const updateNotify = () => toast('Chapter is updated');

    const deleteNotify = () => toast('Chapter is deleted');

    const submitHandler = (event) => {
        event.preventDefault();

        axios.post(`${constants.url}chapter?subject_id=${props.match.params.id}`, {
            chapterName: enteredName
        });

        updateHandler();

        setEnteredName('');

        handleAddClose();
    };

    useEffect(() => {
        const getChapters = async () => {
            const response = await axios.get(
                `${constants.url}chapter?subject_id=${props.match.params.id}`
            );
            setChapters(response.data);
            setIsLoading(false);
        };

        getChapters();
    }, [update]);

    const RenderChapters = ({ isLoading, chapters }) => {
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
                {chapters.map((data) => {
                    return (
                        <ChapterCard
                            key={data.cId}
                            cId={data.cId}
                            chapterName={data.chapterName}
                            subjectName={data.subjectName}
                            topicData={data.topics}
                            handleShowAlert={handleShowAlert}
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
                <Button className='mb-md-3' variant='primary' onClick={handleAddShow}>
                    Add New Chapter
                </Button>

                <Modal show={showAdd} onHide={handleAddClose}>
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

export default IndividualChapterComponent;
