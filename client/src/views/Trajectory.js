import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radar }  from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography'
import 'moment-timezone';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    maxWidth: 1020,
    marginTop: 90,
    marginBottom: 90,
    justifyContent: 'center',
    },
  chart: {
    color: theme.palette.text.primary,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const Trajectory = props => {
  const { navValue, setNavValue, logoutUser } = props;

  const classes = useStyles();
  const [sessionUserId, setSessionUserId] = useState('');
  const [sessionUser, setSessionUser] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (navValue !== 'trajectory'){
      setNavValue('trajectory');
    }
    let one = 'http://localhost:8000/api/users/one';
    const requestOne = axios.get(one, { withCredentials: true });
    requestOne
      .then(response => {
        if (response.data.message === 'success' && isMounted) {
          setSessionUserId(response.data.results._id);
          setSessionUser(response.data.results);
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

  const getCategoryNames = (arr) => {
    let names = [];
    for (let i = 0; i<arr.length; i++){
      names.push(arr[i].name.toString());
    }
    const namesArray = (Object.values(names));
    return namesArray;
  }
  const myLabels = getCategoryNames(allCategories);
  
  // Get 1 week of completed tasks, 'rolling' (1 week ago from now);
  const getWeekTasks = (arr, category) => {
    let filteredLength = [];
    let filteredTasks = [];
    let now = moment().calendar();
    let weekAgo = moment().subtract(7, 'days').calendar();
    moment(now).toISOString();
    moment(weekAgo).toISOString();
    for (let i = 0; i<category.length; i++){
      filteredLength.push(arr.filter(t => t.completed === true
        && t.category === category[i] 
        ).length);
      filteredTasks.push(arr.filter(t => (t.completed === true && t.category === category[i]) 
      && (t.completedAt < now && t.completedAt > weekAgo)
      ));
    }
    return filteredLength;
  }
  const WeeklyCompleted = getWeekTasks(allTasks, myLabels);

  // Get 1 month of completed tasks, 'rolling' (1 month ago from now);
  const getMonthTasks = (arr, category) => {
    let filteredLength = [];
    let filteredTasks = [];
    let now = moment().calendar();
    let monthAgo = moment().subtract(1, 'months').calendar();
    moment(now).toISOString();
    moment(monthAgo).toISOString();
    for (let i = 0; i<category.length; i++){
      filteredLength.push(arr.filter(t => t.completed === true
        && t.category === category[i] 
        ).length);
      filteredTasks.push(arr.filter(t => (t.completed === true && t.category === category[i]) 
      && (t.completedAt < now && t.completedAt > monthAgo)
      ));
    }
    return filteredLength;
  }

  const MonthlyCompleted = getMonthTasks(allTasks, myLabels);
  // Get 1 year of completed tasks, 'rolling' (1 year ago from now);
  const getYearTasks = (arr, category) => {
    let filteredLength = [];
    let filteredTasks = [];
    let now = moment().calendar();
    let yearAgo = moment().subtract(1, 'years').calendar();
    moment(now).toISOString();
    moment(yearAgo).toISOString();
    for (let i = 0; i<category.length; i++){
      filteredLength.push(arr.filter(t => t.completed === true
        && t.category === category[i] 
        ).length);
      filteredTasks.push(arr.filter(t => (t.completed === true && t.category === category[i]) 
      && (t.completedAt < now && t.completedAt > yearAgo)
      ));
    }
    return filteredLength;
  }
  const YearlyCompleted = getYearTasks(allTasks, myLabels);

  const data = {
    labels: myLabels,
    datasets: [
      {
        label: "Rolling Weekly",
        backgroundColor: "rgba(220,220,220,0.2)",
        pointBackgroundColor: "rgba(220,220,220,1)",
        data: WeeklyCompleted
      }, {
        label: 'Rolling Monthly',
        hidden: false,
        data: MonthlyCompleted
      }, {
        label: "Rolling Yearly",
        backgroundColor: "rgba(151,187,205,0.2)",
        pointBackgroundColor: "rgba(151,187,205,1)",
        hoverPointBackgroundColor: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: YearlyCompleted
      }
    ]
  }
  const options = {
    legend: {
      position: 'top',
      labels: {
        fontSize: 18,
      }
    },
    title: {
      display: false,
      text: 'Trajectory',
      fontSize: 24,
    },
    scale: {
      reverse: false,
      gridLines: {
        color: [
          'black',
          'red',
          'orange',
          'yellow',
          'green',
          'blue',
          'indigo',
          'violet'
        ]
      },
      pointLabels: {
        fontSize: 15,
      },
      ticks: {
        beginAtZero: true, 
      },
      maintainAspectRatio: true,
    },
  }
  
  return (
    <Container className={classes.root}>
      <Typography 
        variant='h5'
        className={classes.title}>
        Trajectory
      </Typography>
      <Radar
        className={classes.chart}
        data={data}
        options={options}
        width={39}
        height={45}
        style={{paddingTop: 20, paddingBottom: 20}}
      />
    </Container>
  );
}

export default Trajectory;
