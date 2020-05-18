import React, { useRef } from 'react'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface IProps{
    imagePreview : string,
    setImage : (file:Blob) => void
}
const PhotoWidgetCropper:React.FC<IProps> = ({imagePreview,setImage}) => {

    const cropImage = ()=>{
       if(cropper.current && typeof cropper.current.getCroppedCanvas() === 'undefined') {
           
        return;
       }

       cropper && cropper.current && cropper.current.getCroppedCanvas().toBlob((blob:any)=>{
            setImage(blob);
       },'image/jpeg')
    }

    const cropper = useRef<Cropper>(null);
    return (
        <Cropper
        ref={cropper}
        src={imagePreview}
        style={{height: 200, width: '100%'}}
        // Cropper.js options
        aspectRatio={1 / 1}
        guides={false}
        dragMode='move'
        scalable={true}
        cropBoxMovable={true}
        cropBoxResizable={true}
        crop={cropImage}
        preview='.img-preview'
         />
    )
}
export default PhotoWidgetCropper;
