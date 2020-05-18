import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import {
  Tab,
  Header,
  Card,
  Image,
  Button,
  Grid,
} from "semantic-ui-react";
import { PhotoUploadWidget } from "../../app/common/PhotoUpload/PhotoUploadWidget";
import { observer } from "mobx-react-lite";

const ProfilePhoto = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loading,
    deletePhoto
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(true);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="photos"></Header>
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              loading={uploadingPhoto}
              uploadPhoto={handleUploadImage}
            ></PhotoUploadWidget>
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url}></Image>
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          positive
                          basic
                          content="Main"
                          onClick={(e) => {
                            setMainPhoto(photo);
                            setTarget(e.currentTarget.name);
                          }}
                          loading={target === photo.id && loading}
                          name={photo.id}
                          disabled={photo.isMain}
                        ></Button>
                        <Button
                          negative
                          basic
                          icon="trash"
                          disabled={photo.isMain}
                          onClick={(e) => {
                            deletePhoto(photo);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          loading={deleteTarget === photo.id && loading}
                          name={photo.id}
                        ></Button>
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhoto);
