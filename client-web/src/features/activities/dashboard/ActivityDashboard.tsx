import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilter from "./ActivityFilter";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

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
    console.log(
      `loadingNext : ${!loadingNext}  page : ${
        page + 1
      } < totalPages : ${totalPages}`
    );
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);
 
  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ActivityList></ActivityList>
          </InfiniteScroll>
        )}
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
