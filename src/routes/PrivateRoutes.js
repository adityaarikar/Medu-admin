import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import Subjects from './Subjects/Subjects';
import Topics from './Topics/Topics';
import Chapters from './Chapters/Chapters';
import IndividualChapterComponent from './Chapters/IndividualChapterComponent';
import IndividualTopicComponent from './Topics/IndividualTopicComponent';
import Privacy from './Privacy/index';

const DashboardComponent = lazy(() => import('./dashboard'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.home} component={DashboardComponent} />
                <Route path={SLUGS.subjects} component={Subjects} />
                <Route path={SLUGS.chapters} component={Chapters} />
                <Route path={SLUGS.topics} component={Topics} />
                <Route path={SLUGS.getChapterBySubject} component={IndividualChapterComponent} />
                <Route path={SLUGS.getTopicByChapter} component={IndividualTopicComponent} />
                <Route path={SLUGS.privacy} component={Privacy} />
                <Redirect to={SLUGS.home} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;
