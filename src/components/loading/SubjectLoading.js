import React from 'react';
import { Card } from 'react-bootstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SubjectLoading = () => {
    return (
        <SkeletonTheme>
            <Card style={{ width: '20rem', marginBottom: '30px ', textAlign: 'center' }}>
                <Card.Header>
                    <Skeleton />
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle className='mb-2 text-muted'>
                        <Skeleton />
                    </Card.Subtitle>
                    <Skeleton width={100} />
                    <div
                        style={{
                            marginTop: '15px',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    >
                        <Skeleton width={50} />
                        <Skeleton width={50} />
                    </div>
                </Card.Body>
            </Card>
        </SkeletonTheme>
    );
};

export default SubjectLoading;
