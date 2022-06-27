import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import SLUGS from 'resources/slugs';
import { Link } from 'react-router-dom';
import axios from 'axios';

const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: 30,
        paddingRight: 30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    }
});

function DashboardComponent() {
    const classes = useStyles();
    const [subjects, setSubjects] = useState();
    const [chapters, setChapters] = useState();
    const [topics, setTopics] = useState();

    useEffect(() => {
        axios.get('http://localhost:8080/subject').then((response) => {
            setSubjects(response.data);
        });
        axios.get('http://localhost:8080/chapters').then((response) => {
            setChapters(response.data);
        });
        axios.get('http://localhost:8080/topics').then((response) => {
            setTopics(response.data);
        });
    }, []);

    return (
        <Column>
            <h1>Home</h1>
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
                    <Card.Header>Subjects</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            Total : {subjects === undefined ? null : Object.keys(subjects).length}
                        </Card.Title>
                        <Link to={SLUGS.subjects}>
                            <Button variant='primary'>Go To Subjects</Button>
                        </Link>
                    </Card.Body>
                </Card>
                <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
                    <Card.Header>Chapters</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            Total : {chapters === undefined ? null : Object.keys(chapters).length}
                        </Card.Title>
                        {/* <Card.Text>10</Card.Text> */}
                        <Link to={SLUGS.chapters}>
                            <Button variant='primary'>Go To Subjects</Button>
                        </Link>
                    </Card.Body>
                </Card>
                <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
                    <Card.Header>Topics</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            Total : {topics === undefined ? null : Object.keys(topics).length}
                        </Card.Title>
                        <Link to={SLUGS.topics}>
                            <Button variant='primary'>Go To Topics</Button>
                        </Link>
                    </Card.Body>
                </Card>
                <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
                    <Card.Img variant='top' src='holder.js/100px180' />
                    <Card.Body>
                        <Card.Title>Users</Card.Title>
                        <Card.Text>10</Card.Text>
                        {/* <Button variant='primary'>Go somewhere</Button> */}
                    </Card.Body>
                </Card>
            </Row>
        </Column>
    );
}

export default DashboardComponent;
