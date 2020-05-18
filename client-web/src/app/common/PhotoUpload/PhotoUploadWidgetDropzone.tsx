import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface IProps {
  setFiles: (files: object[]) => void;
}

const dropzoneStyles = {
    
    border:'dashed 3px',
    borderColor:'#eee',
    borderRadius:'5px',
    paddingTop:'30px',
    textAlign : 'center' as 'center',
    height:'200px'
}

const dropzoneActive = {   
    borderColor:'green'    
}

const PhotoUploadWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    //console.log(acceptedFiles);
    const fileData = acceptedFiles.map((file: object) => {
      return Object.assign(file, { preview: URL.createObjectURL(file) });
    });
    setFiles(fileData);
  }, [setFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={isDragActive?{...dropzoneStyles,...dropzoneActive}:dropzoneStyles}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default PhotoUploadWidgetDropzone;
