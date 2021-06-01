import { Button, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import React, { useEffect, useState } from "react";
import { AddRoomStyle } from "../styles/addroom";
import { addRoomFormValidated } from "../utils/formValidator";

const AddRoom = ({ socket }) => {
  const [open, setOpen] = useState(false);
  const [formValidateMsg, setFormValidateMsg] = useState([]);

  useEffect(() => {
    socket.on("ADD_ROOM_STATUS", (data) => {
      if (data["ok"]) {
        // Room has been added
        handleClose();
      } else {
        console.log(data["msg"]);
      }
    });
  });

  const handleOpen = () => {
    setFormValidateMsg([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let formRoomName = React.createRef();

  const handleAddRoom = (e) => {
    e.preventDefault();
    var validation = addRoomFormValidated(formRoomName.current.value);

    setFormValidateMsg(validation[1]);

    if (validation[0] === true) {
      socket.emit("ADD_ROOM", {
        room_name: formRoomName.current.value,
      });
    }
  };

  return (
    <div>
      <Button
        style={AddRoomStyle.addRoomBtn}
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Create New Room
      </Button>
      <Modal
        style={AddRoomStyle.modal}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div style={AddRoomStyle.divInModal}>
            <h2 id="transition-modal-title">
              Add new <span style={AddRoomStyle.roomText}>Room</span>
            </h2>
            <form noValidate autoComplete="off" onSubmit={handleAddRoom}>
              <TextField
                inputRef={formRoomName}
                id="standard-basic"
                label="Room Name"
                size="medium"
              />
              <div style={AddRoomStyle.spaceAddDiv}></div>

              <Button type="submit" variant="contained" color="primary">
                Add Room
              </Button>

              <ul style={AddRoomStyle.formErrMsgUl}>
                {formValidateMsg.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AddRoom;
