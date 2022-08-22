import React, { useEffect, useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import SubjectCard from 'components/cards/SubjectCard';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubjectLoading from 'components/loading/SubjectLoading';
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

const Subjects = () => {
    const classes = useStyles();
    const [subjects, setSubjects] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [enteredName, setEnteredName] = useState('');

    const changeNameHandler = (event) => {
        setEnteredName(event.target.value);
    };

    const updateNotify = () => toast('Subject is updated');

    const deleteNotify = () => toast('Subject is deleted');

    const postData = async () => {
        try {
            await axios.post(`${constants.url}subject`, {
                name: enteredName
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

    const getSubjects = async () => {
        try {
            const response = await axios.get(`${constants.url}subject`);

            setSubjects(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSubjects();
        console.log('executed');
    }, [update]);

    const RenderSubjects = ({ subjects, isLoading }) => {
        return isLoading ? (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                <SubjectLoading />
                <SubjectLoading />
                <SubjectLoading />
                <SubjectLoading />
                <SubjectLoading />
                <SubjectLoading />
            </Row>
        ) : (
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-evenly'
                breakpoints={{ 768: 'column' }}
            >
                {subjects.length === 0 ? (
                    <>No subjects are added...</>
                ) : (
                    subjects.map((data) => {
                        return (
                            <SubjectCard
                                key={data.sId}
                                sId={data.sId}
                                subjectName={data.name}
                                chaptersData={data.chapters}
                                setShowAlert={setShowAlert}
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
                <h1>Subjects</h1>
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
                    Add New Subject
                </Button>

                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Subject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='form.name' className='mb-3'>
                                <Form.Label>Subject Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={enteredName}
                                    onChange={changeNameHandler}
                                    placeholder='Topic....'
                                    required
                                />
                            </Form.Group>
                            <Button variant='primary' type='submit' onSubmit={submitHandler}>
                                Add Subject
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Row>
            <Row wrap flexGrow={1} horizontal='space-between' breakpoints={{ 768: 'column' }}>
                <Alert show={showAlert} variant='danger'>
                    <Alert.Heading>Are you sure you want to delete it?</Alert.Heading>
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button onClick={() => setShowAlert(true)} variant='outline-success'>
                            Yes I'm Sure
                        </Button>
                    </div>
                </Alert>
            </Row>
            <RenderSubjects isLoading={isLoading} subjects={subjects} />
        </Column>
    );
};

export default Subjects;
