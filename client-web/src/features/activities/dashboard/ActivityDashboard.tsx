import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilter from './ActivityFilter'

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {    
    console.log(`loadingNext : ${!loadingNext}  page : ${page + 1} < totalPages : ${totalPages}`)
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {    
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial && page === 0)
    return (
      <LoadingComponent content="Loading Activities...."></LoadingComponent>
    );

  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ActivityList></ActivityList>
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width={6}>
       <ActivityFilter></ActivityFilter>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext}></Loader>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
