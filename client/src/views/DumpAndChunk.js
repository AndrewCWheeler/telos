import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {navigate} from '@reach/router';
// My components and modified material-ui components:
import AllDumpedList from '../components/AllDumpedList';
import DumpComponent from '../components/DumpComponent';
import SimpleSnackbar from '../components/SimpleSnackBar';
// Material-ui core components:
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 840,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  subtitle: {
    color: theme.palette.primary.main,
  },
}));

const DumpAndChunk = props => {
  const inputRef = useRef();
  const dumpRef = useRef();
  const editRef = useRef();
  const classes = useStyles();
  const { navValue, setNavValue, logoutUser } = props;
  const [sessionUserId, setSessionUserId] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [load, setLoad] = useState(0);
  const [openDumpSubmit, setOpenDumpSubmit] = useState(false);
  const [openDumpEdit, setOpenDumpEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snack, setSnack] = useState('');
  const [severity, setSeverity] = useState('');
  const [task, setTask] = useState({
    name: '',
    category: '',
    chunked: false,
    scheduled: false,
    scheduledAt: '',
    completed: false,
    completedAt: '',
    priority: 0,
    owner: '',
  });

  useEffect(() => {
    let isMounted = true;
    if (navValue !== 'dump'){
      setNavValue('dump');
    }
    let one = 'http://localhost:8000/api/users/one';
    const requestOne = axios.get(one, { withCredentials: true });
    requestOne
      .then(response => {
        if (response.data.message === 'success' && isMounted) {
          setSessionUserId(response.data.results._id);
        }
      })
      .catch(()=>{
        logoutUser();
      });
    let two = 'http://localhost:8000/api/tasks/user';
    const requestTwo = axios.get(two, { withCredentials: true });
    requestTwo
      .then(response => {
        if (response.data.message === 'success' && isMounted){
          let orderedTasks = response.data.results;
          orderedTasks.sort((a,b) => a.priority - b.priority)
          setAllTasks(orderedTasks);
        }
      })
      .catch();
    let three = 'http://localhost:8000/api/categories/user';
    const requestThree = axios.get(three, {withCredentials: true });
    requestThree
      .then(response => {
        if (isMounted) setAllCategories(response.data.results);
      })
      .catch();
    axios
      .all([requestOne, requestTwo, requestThree])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
        })
      )
      .catch();
      return () => { isMounted = false }
  }, [load]);

  const handleOpenDumpSubmit = () => {
    setOpenDumpSubmit(true);
  }
  const handleCloseDumpSubmit = () => {
    setOpenDumpSubmit(false);
  }

  const handleOpenDumpEdit = (e, id) => {
    onClickHandler(e, id);
    setOpenDumpEdit(true);
  }
  const handleCloseDumpEdit = () => {
    setOpenDumpEdit(false);
    setTask({
      name: '',
      category: '',
      chunked: false,
      scheduled: false,
      scheduledAt: '',
      completed: false,
      priority: 0,
      completedAt: '',
      owner: '',
    });
  }

  const handleOpenSnackBar = (snack, severity) => {
    setOpenSnack(true);
    setSnack(snack); 
    setSeverity(severity)
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const handleOpen = (e, id) => {
    onClickHandler(e, id);
    setOpen(true);
  };
  const handleClose = (e) => {
    setOpen(false);
    setTask({
      name: '',
    category: '',
    chunked: false,
    scheduled: false,
    scheduledAt: '',
    completed: false,
    completedAt: '',
    priority: 0,
    owner: '',
    });
  };

  const removeFromDom = taskId => {
    setAllTasks(allTasks.filter(task => task._id !== taskId));
  };

  const onClickHandler = (e, id) => {
    axios
      .get(`http://localhost:8000/api/tasks/${id}`, { withCredentials: true })
      .then(res => {
        if (res.data.message === 'success') {
          setTask(res.data.results);
        }
      }).catch();
  };

  const onChangeHandler = e => {
    setTask({
      ...task,
      owner: sessionUserId,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeChunkHandler = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmitHandler(e);
    }
  }
  const handleKeyDownEdit = (e, id) => {
    if (e.key === 'Enter') {
      onPatchEditNameHandler(e, id);
    }
  }

  const onSubmitHandler = (e) => {
    if (task.name === ''){
      handleOpenSnackBar("You have to enter something!", "error")
    }
    axios
      .post(`http://localhost:8000/api/tasks/${sessionUserId}`, task, {
        withCredentials: true,
      })
      .then(res => {
        setTask({
          name: '',
          category: '',
          chunked: false,
          scheduled: false,
          scheduledAt: '',
          completed: false,
          completedAt: '',
          owner: '',
        });
        handleCloseDumpSubmit();
        load === 1 ? (setLoad(0)) : setLoad(1);
      })
      .catch();
  };

  const onPatchHandler = (e, taskId, cat, snack, severity) => {
    // Assign arguments to applicable targets:
    if (selectedCategory === ''){
      handleOpenSnackBar("You must select a category!", "warning")
      return
    }
    let catId = '';
    catId = cat._id;
    // task.labelIdentity = cat._id;
    task.category = cat.name;
    task.chunked = true;
    // Split up axios calls to update both task component and category component:
    let one = `http://localhost:8000/api/tasks/${taskId}`
    const requestOne = axios.patch(one, task, { withCredentials: true });
    requestOne
      .then(res => {
        if(res.data.message === 'success'){
          handleOpenSnackBar(snack, severity);
          removeFromDom(taskId);
          handleClose();
        }
        load === 1 ? (setLoad(0)) : setLoad(1);
      })
      .catch();
    let two = `http://localhost:8000/api/categories/${catId}`;
    const requestTwo = axios.patch(two, task, { withCredentials: true});
    requestTwo
      .then(res => {
      })
      .catch();
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
        })
      )
      .catch();
  };

  const onPatchEditNameHandler = (e, id) => {
    axios
      .patch('http://localhost:8000/api/tasks/' + id, task, {
        withCredentials: true,
      })
      .then(res => {
        if (res.data.message === 'success'){
          setTask({
            name: '',
            category: '',
            chunked: false,
            scheduled: false,
            scheduledAt: '',
            completed: false,
            completedAt: '',
            owner: '',
          });
          handleCloseDumpEdit();
          handleOpenSnackBar("Task Updated!", "success");
          load === 1 ? (setLoad(0)) : setLoad(1);
        }
      })
      .catch();
  };

  return (
    <div>
      <CssBaseline />
      <div style={{marginTop:'90px'}}>
        <Typography
          className={classes.title}
          variant='h5'
        >
          Dump & Chunk
        </Typography>
      </div>
      <DumpComponent
        task={task}
        dumpRef={dumpRef}
        inputRef={inputRef}
        onChangeHandler={onChangeHandler}
        onSubmitHandler={onSubmitHandler}
        handleKeyDown={handleKeyDown}
        openDumpSubmit={openDumpSubmit}
        setOpenDumpSubmit={setOpenDumpSubmit}
        handleOpenDumpSubmit={handleOpenDumpSubmit}
        handleCloseDumpSubmit={handleCloseDumpSubmit}
      />
      <AllDumpedList
        editRef={editRef}
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        openDumpEdit={openDumpEdit}
        setOpenDumpEdit={setOpenDumpEdit}
        handleOpenDumpEdit={handleOpenDumpEdit}
        handleCloseDumpEdit={handleCloseDumpEdit}
        onClickHandler={onClickHandler}
        task={task}
        setTask={setTask}
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        allCategories={allCategories}
        removeFromDom={removeFromDom}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onPatchHandler={onPatchHandler}
        onChangeHandler={onChangeHandler}
        onChangeChunkHandler={onChangeChunkHandler}
        handleKeyDownEdit={handleKeyDownEdit}
        onPatchEditNameHandler={onPatchEditNameHandler}
      />
      <SimpleSnackbar 
        severity={severity}
        setSeverity={setSeverity}
        snack={snack}
        openSnack={openSnack}
        handleOpenSnackBar={handleOpenSnackBar}
        handleCloseSnackBar={handleCloseSnackBar} 
      />
    </div>
  );
};

export default DumpAndChunk;
