import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from "@material-ui/core/Avatar";
import "./CreatePost.css";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import { storage, auth } from "./FirebaseConfig";
import Spinner from "./Spinner";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper ({ showModal,  user}) {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const [progress, setProgress] = useState(0);
  const [imageObj, setImageobj] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    imageObj && handlePost(imageObj)
  },[imageObj])
  
  const handlePost = (imageObj) => {
    if (imageObj) {
      setLoading(true);
      const uploadTask = storage.ref(`profile_images/${imageObj.name}`).put(imageObj);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          alert(error.message);
        },
        () => {
          storage
            .ref("profile_images")
            .child(imageObj.name)
            .getDownloadURL()
            .then((url) => {
              auth.currentUser.updateProfile({photoURL:url})
              closeModal();
              window.location.reload()
            }).catch(error=>alert(error.message));
        }
      );
    } else {
      setLoading(false);
      setError("Photo required");
    }
  };
  const closeModal = () => {
    showModal(false);
  };

  const inputFileRef = useRef(null);

  const onBtnClick = () => {
    inputFileRef.current.click();
  };
  

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const updateProfile = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
    canvas.toBlob((blob) => {
        let file = new File([blob],user&&user.displayName, { type: "image/jpeg" })
        setImageobj(file)
      }, 'image/jpeg');
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  return (
    <div>
      {error ? alert(error) : ""}
      <Dialog
        open={true}
        onClose={() => showModal(false)}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <Avatar
              className="imageCropper_avatar"
              alt={user && user.displayName}
              src={user.photoURL}
            />
            <h3>{user && user.displayName}</h3>
          </div>
          <input
            style={{ display: "none" }}
            type="file"
            ref={inputFileRef}
            accept="image/*"
            onChange={onSelectFile}
          />

          <div className="uploadBtnCenter">
            <IconButton
              onClick={onBtnClick}
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </div>
          <div>
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            />
          </div>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                display: "none",
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>
        </DialogContent>

        <DialogActions>
          {loading ? (
            <Spinner />
          ) : (
            <div>
              <Button onClick={() => showModal(false)} color="primary">
                Cancel
              </Button>
              <Button
                disabled={!completedCrop?.width || !completedCrop?.height}
                onClick={() =>
                  updateProfile(previewCanvasRef.current, completedCrop)
                }
                color="primary"
              >
                Save
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ImageCropper;
