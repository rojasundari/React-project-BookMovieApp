import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Header from '../../common/Header';
import './Home.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  upcomingMoviesHeading: {
    textAlign: 'center',
    background: '#ff9999',
    padding: '8px',
    fontSize: '1rem'
  },
  gridListUpcomingMovies: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    width: '100%'
  },
  gridListMain: {
    transform: 'translateZ(0)',
    cursor: 'pointer'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240
  },
  title: {
    color: theme.palette.primary.light,
  }
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      movieName: "",
      upcomingMovies: [{}],
      releasedMovies: [{}],
      genresList: [{}],
      artistsList: [{}],
      genres: [],
      artists: [],
      releaseDateStart: "",
      releaseDateEnd: ""
    }
  }

  componentWillMount() {

    //Getting Upcoming Movies
    let xhrUpcoming = new XMLHttpRequest();
    let dataUpcoming = null;
    let that = this;
    xhrUpcoming.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({ upcomingMovies: JSON.parse(this.responseText).movies });
      }
    })

    xhrUpcoming.open("GET", this.props.baseUrl + "movies?status=PUBLISHED");
    xhrUpcoming.setRequestHeader("Cache-Control", "no-cache");
    xhrUpcoming.send(dataUpcoming);

    //Getting Released Movies
    let dataReleased = null;
    let xhrReleased = new XMLHttpRequest();
    xhrReleased.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({ releasedMovies: JSON.parse(this.responseText).movies });
      }
    })

    xhrReleased.open("GET", this.props.baseUrl + "movies?status=RELEASED");
    xhrReleased.setRequestHeader("Cache-Control", "no-cache");
    xhrReleased.send(dataReleased);

    //Getting all Genres
    let dataGenres = null;
    let xhrGenres = new XMLHttpRequest();
    xhrGenres.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({ genresList: JSON.parse(this.responseText).genres });
      }
    })

    xhrGenres.open("GET", this.props.baseUrl + "genres");
    xhrGenres.setRequestHeader("Cache-Control", "no-cache");
    xhrGenres.send(dataGenres);

    //Getting all Artists
    let dataArtists = null;
    let xhrArtists = new XMLHttpRequest();
    xhrArtists.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({ artistsList: JSON.parse(this.responseText).artists });
      }
    })

    xhrArtists.open("GET", this.props.baseUrl + "artists");
    xhrArtists.setRequestHeader("Cache-Control", "no-cache");
    xhrArtists.send(dataArtists);
  }

  movieNameChangeHandler = event => {
    this.setState({ movieName: event.target.value });
  }

  genreSelectHandler = event => {
    this.setState({ genres: event.target.value });
  }

  artistsSelectHandler = event => {
    this.setState({ artists: event.target.value });
  }

  releaseDateStartHandler = event => {
    this.setState({ releaseDateStart: event.target.value });
  }

  releaseDateEndHandler = event => {
    this.setState({ releaseDateEnd: event.target.value });
  }

  movieClickHandler = (movieId) => {
    this.props.history.push('/movie/' + movieId);
  }

  filterApplyHandler = () => {

    let queryString = "?status=RELEASED";

    if (this.state.movieName !== "") {
      queryString += "&title=" + this.state.movieName;
    }

    if (this.state.genres.length > 0) {
      queryString += "&genre=" + this.state.genres.toString();
    }

    if (this.state.artists.length > 0) {
      queryString += "&artists=" + this.state.artists.toString();
    }

    if (this.state.releaseDateStart !== "") {
      queryString += "&start_date=" + this.state.releaseDateStart
    }

    if (this.state.releaseDateEnd !== "") {
      queryString += "&end_date=" + this.state.releaseDateEnd
    }

    let that = this;
    let dataFilter = null;
    let xhrFilter = new XMLHttpRequest();
    xhrFilter.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        that.setState({ releasedMovies: JSON.parse(this.responseText).movies });
      }
    })

    xhrFilter.open("GET", this.props.baseUrl + "movies" + encodeURI(queryString));
    xhrFilter.setRequestHeader("Cache-Control", "no-cache");
    xhrFilter.send(dataFilter);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {/* Implementation for Header on Home Page */}
        <Header baseUrl={this.props.baseUrl} />

        {/* Implementation of Upcoming Movies Tab */}
        <div className={classes.upcomingMoviesHeading}>
          <span> Upcoming Movies </span>
        </div>
        <GridList cellHeight={250} cols={6} className={classes.gridListUpcomingMovies}>
          {this.state.upcomingMovies.map(movie => (
            <GridListTile key={"upcoming" + movie.id}>
              <img src={movie.poster_url} alt={movie.title} />
              <GridListTileBar title={movie.title} />
            </GridListTile>
          ))}
        </GridList>

        {/* Implementation of Home Page in two sections */}
        <div className="flex-container">

          {/* Implementation for Left Section- Released Movie Grid Functionality*/}
          <div className="left">
            <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
              {this.state.releasedMovies.map(movie => (
                <GridListTile onClick={() => this.movieClickHandler(movie.id)} className="marginMovie" key={"grid" + movie.id}>
                  <img src={movie.poster_url} alt={movie.title} />
                  <GridListTileBar
                    title={movie.title}
                    subtitle={<span>Release Date: {new Date(movie.release_date).toDateString()}</span>}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>

          {/* Implementation for Right Section- Filters for Movie Search Functionality */}
          <div className="right">
            <Card>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <Typography className={classes.title} color="textSecondary">
                    FIND MOVIES BY:
                  </Typography>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="movieName"> Movie Name </InputLabel>
                  <Input id="movieName" onChange={this.movieNameChangeHandler} />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox"> Genre</InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(',')}
                    value={this.state.genres}
                    onChange={this.genreSelectHandler}>
                    <MenuItem value="0">None
                    </MenuItem>
                    {this.state.genresList.map(genre => (
                      <MenuItem key={"genre" + genre.id} value={genre.genre}>
                        <Checkbox checked={this.state.genres.indexOf(genre.genre) > - 1} />
                        <ListItemText primary={genre.genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox"> Artists</InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => selected.join(',')}
                    value={this.state.artists}
                    onChange={this.artistsSelectHandler}>
                    <MenuItem value="0">None
                    </MenuItem>
                    {this.state.artistsList.map(artist => (
                      <MenuItem key={"artist" + artist.id} value={artist.first_name + " " + artist.last_name}>
                        <Checkbox checked={this.state.artists.indexOf(artist.first_name + " " + artist.last_name) > - 1} />
                        <ListItemText primary={artist.first_name + " " + artist.last_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateStart"
                    label="Release Date Start"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={this.releaseDateStartHandler}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateEnd"
                    label="Release Date End"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={this.releaseDateEndHandler}
                  />
                </FormControl><br /><br />
                <FormControl className={classes.formControl}>
                  <Button onClick={() => this.filterApplyHandler()} variant="contained" color="primary">
                    APPLY
                  </Button>
                </FormControl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Home);