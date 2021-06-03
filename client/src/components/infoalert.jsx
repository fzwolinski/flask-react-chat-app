import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import React from "react";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const InfoAlert = ({ alert, setAlert }) => {
  const handleHideAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert([false, alert[1], alert[2]]);
  };

  return (
    <Snackbar open={alert[0]} autoHideDuration={2500} onClose={handleHideAlert}>
      <Alert severity={alert[2]}>{alert[1]}</Alert>
    </Snackbar>
  );
};

export default InfoAlert;
