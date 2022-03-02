import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import YouTube from 'react-youtube';
import Header from '../../common/Header';
import './Details.css';

class Details extends Component {

    constructor() {
        super();
        this.state = {
            movie: {
                genres: [],
                trailer_url: "",
                artists: []
            },
            starIcons: [{
                id: 1,
                stateId: "star1",
                color: "black"
            },
            {
                id: 2,
                stateId: "star2",
                color: "black"
            },
            {
                id: 3,
                stateId: "star3",
                color: "black"
            },
            {
                id: 4,
                stateId: "star4",
                color: "black"
            },
            {
                id: 5,
                stateId: "star5",
                color: "black"
            }]
        }
    }

    componentWillMount() {
        let xhrMovie = new XMLHttpRequest();
        let dataMovie = null;
        let that = this;
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ movie: JSON.parse(this.responseText) });
            }
        })

        xhrMovie.open("GET", this.props.baseUrl + "movies/" + this.props.match.params.id);
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(dataMovie);
    }

    artistClickHandler = (url) => {
        window.location = url;
    }

    starClickHandler = (id) => {
        let starIconList = [];
        for (let star of this.state.starIcons) {
            let starNode = star;
            if (star.id <= id) {
                starNode.color = "yellow";
            }
            else {
                starNode.color = "black";
            }
            starIconList.push(starNode);
        }
        this.setState({ starIcons: starIconList });
    }

    render() {
        let movie = this.state.movie;
        const opts = {
            height: '300',
            width: '700',
            playerVars: {
                autoplay: 1
            }
        }
        return (
            <div className="details">
                {/* Implementation of Header on Details Page */}
                <Header id={this.props.match.params.id} baseUrl={this.props.baseUrl} showBookShowButton="true" />

                {/* Implementation of < Back to Home link */}
                <div className="back">
                    <Typography>
                        <Link to="/">  &#60; Back to Home</Link>
                    </Typography>
                </div>

                {/* Implementation of Details Page in three sections */}
                <div className="flex-containerDetails">

                    {/* Implementation of left section- Movie Poster */}
                    <div className="leftDetails">
                        <img src={movie.poster_url} alt={movie.title} />
                    </div>

                    {/* Implementation of middle section- Movie Details and Trailer 
                    
                    Note: Since the API call has fields storyline and rating, so
                          1) Have used "movie.storyline" instead of "movie.story_line"
                          2) Have used "movie.rating" instead of "movie.critics_rating"*/}
                    <div className="middleDetails">
                        <div>
                            <Typography variant="headline" component="h2">{movie.title} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Genre: </span> {movie.genres.join(', ')} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Duration:</span> {movie.duration} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Release Date:</span> {new Date(movie.release_date).toDateString()} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Rating:</span> {movie.rating}  </Typography>
                        </div>
                        <div className="marginTop16">
                            <Typography><span className="bold">Plot:</span> <a href={movie.wiki_url}>(Wiki Link)</a> {movie.storyline} </Typography>
                        </div>
                        <div className="trailerContainer">
                            <Typography><span className="bold">Trailer:</span></Typography>
                            <YouTube
                                videoId={movie.trailer_url.split("?v=")[1]}
                                opts={opts}
                                onReady={this._onReady}
                            />
                        </div>
                    </div>

                    {/* Implementation of right section- Rate functionality and Artists Details */}
                    <div className="rightDetails">
                        <Typography> <span className="bold">Rate this movie: </span></Typography>
                        {this.state.starIcons.map(star => (
                            <StarBorderIcon className={star.color} key={"star" + star.id} onClick={() => this.starClickHandler(star.id)} />
                        ))}
                        <div className="bold marginBottom16 marginTop16"><Typography><span className="bold">Artists:</span></Typography></div>
                        <GridList cellHeight={160} cols={2}>
                            {movie.artists.map(artist => (
                                <GridListTile className="gridTile" onClick={() => this.artistClickHandler(artist.wiki_url)} key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                    <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div >
        );
    }
}

export default Details;