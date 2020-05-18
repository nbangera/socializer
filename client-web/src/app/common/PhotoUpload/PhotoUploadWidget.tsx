import React, { Fragment, useState, useEffect } from "react";
import { Header, Grid, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import PhotoUploadWidgetDropzone from "./PhotoUploadWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface IProps {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export const PhotoUploadWidget:React.FC<IProps> = ({loading,uploadPhoto}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoUploadWidgetDropzone
            setFiles={setFiles}
          ></PhotoUploadWidgetDropzone>
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && (
            <PhotoWidgetCropper
              imagePreview={files[0].preview}
              setImage={setImage}
            ></PhotoWidgetCropper>
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && (            
            <Fragment>
            <div
              style={{ minHeight: "200px", overflow: "hidden" }}
              className="img-preview"
            ></div>
            <Button.Group widths={2}>
              <Button positive loading={loading}  onClick={()=>uploadPhoto(image!)} icon='check'/>
              <Button  negative disabled={loading}  onClick={()=>setFiles([])} icon='close'/>
            </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(PhotoUploadWidget);
