import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link, navigate } from '@reach/router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


// function Copyright() {
//   return (
//     <Typography variant='body2' color='textSecondary' align='center'>
//       {'Copyright © '}
//       <Link color='inherit' to='https://material-ui.com/'>
//         Telos.com
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  bottom: {
    margin: theme.spacing(3, 0),
  },
  title: {
    margin: theme.spacing(8, 4),
    color: theme.palette.primary.main,
  },
  link: {
    color: theme.palette.info.light,
    "&:active": {
      color: theme.palette.info.main,
    }
  },
}));

// const myTheme = createMuiTheme({
//   overrides: {
//     MuiInputLabel: { // Name of the component ⚛️ / style sheet
//       root: { 
//         color: 'white',// Name of the rule
//         "&$focused": { // increase the specificity for the pseudo class
//           color: 'white',
//         }
//       }
//     }
//   }
// });

export default function SignUp() {
  const classes = useStyles();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onChangeHandler = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/register', user, {
        withCredentials: true,
      })
      .then(res => {
        if (res.data.message === 'success') {
          console.log('User successfully added:');
          console.log(user);
        }
        navigate('/');
      })
      .catch(err => {
        console.log('User was not successfully added:' + err.toString());
      });
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography 
        variant='h2' 
        gutterBottom 
        className={classes.title}
        >
          {'\u03C4\u03AD\u03BB\u03BF\u03C2'}
        </Typography>
        <i className='fa fa-user-o fa-2x' aria-hidden='true'></i>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        {/* <ThemeProvider theme={myTheme}> */}
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='First Name'
                autoFocus
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='lname'
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                id='confirmPassword'
                onChange={onChangeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={onSubmitHandler}
          >
            Sign Up
          </Button>
          <Grid container justify='center' style={{marginTop:54}}>
            <Grid item>
              <Typography align='center' variant='body2'>
                <Link className={classes.link} to='/signin'>Already have an account? Sign in</Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
        {/* </ThemeProvider> */}
      </div>
      {/* <Box mt={5} className={classes.bottom}>
        <Copyright />
      </Box> */}
    </Container>
  );
}