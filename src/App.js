import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            barTitle: '',
            barAddress: '',
            bars: [],            
            beerName: '',
            beerStyle: '',
            beerAlc: '',
            beers: [],
            user: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBarFormSubmit = this.handleBarFormSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
              this.setState({ user });
            } 
        });
        const beersRef = firebase.database().ref('beers');
        beersRef.on('value', (snapshot) => {
          let beers = snapshot.val();
          let newState = [];
          for (let beer in beers) {
            newState.push({
              id: beer,
              beerName: beers[beer].beerName,
              beerStyle: beers[beer].beerStyle,
              beerAlc: beers[beer].beerAlc
            });
          }
          this.setState({
            beers: newState
          });
        });

        const barsRef = firebase.database().ref('bars');
        barsRef.on('value', (snapshot) => {
          let bars = snapshot.val();
          let newState = [];
          for (let bar in bars) {
            newState.push({
              id: bar,
              barTitle: bars[bar].barTitle,
              barAddress: bars[bar].barAddress              
            });
          }
          this.setState({
            bars: newState
          });
        });
      }

    handleBarFormSubmit(e) {
        e.preventDefault();
        const barsRef = firebase.database().ref('bars');
        const bar = {
            barTitle: this.state.barTitle,
            barAddress: this.state.barAddress
        }
        barsRef.push(bar);
        this.setState({
            barTitle: '',
            barAddress: ''
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const beersRef = firebase.database().ref('beers');
        const beer = {
            beerName: this.state.beerName,
            beerStyle: this.state.beerStyle,
            beerAlc: this.state.beerAlc
        }
        beersRef.push(beer);
        this.setState({
            beerName: '',
            beerStyle: '',
            beerAlc: ''
        });    
        
    }
    removeBeer(beerId) {
        const beerRef = firebase.database().ref(`/beers/${beerId}`);
        beerRef.remove();
      }
      logout() {
        auth.signOut()
          .then(() => {
            this.setState({
              user: null
            });
          });
      }
      login() {
        auth.signInWithPopup(provider) 
          .then((result) => {
            const user = result.user;
            this.setState({
              user
            });
          });
      }
  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>{ this.state.barTitle }</h1>
              {this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                <button onClick={this.login}>Log In</button>              
                }

            </div>
        </header>
        {this.state.user ?
            <div>
            <div className='user-profile'>                
                <img src={this.state.user.photoURL} />                
            </div>
            <div className='container'>        
        <section className="add-item">
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="beerName" placeholder="Beer name" onChange={this.handleChange} value={this.state.beerName} />
                <input type="text" name="beerStyle" placeholder="Beer style" onChange={this.handleChange} value={this.state.beerStyle} />
                <input type="text" name="beerAlc" placeholder="Beer alcohol" onChange={this.handleChange} value={this.state.beerAlc} />
                <button>Add beer</button>
            </form>
        </section> 
          
          <section className='display-item'>
            <div className="wrapper">
                <ul>
                {this.state.beers.map((beer) => {
                    return (
                    <li key={beer.id}>
                        <h3>{beer.beerName}</h3>
                        <p>Style: {beer.beerStyle}</p>
                        <p>Alc: {beer.beerAlc} %</p>
                        <p>
                            {this.state.user ?
                            <button onClick={() => this.removeBeer(beer.id)}>Убрать позицию</button> : null}
                        </p>
                    </li>
                    )
                })}
                </ul>
            </div>
        </section>
        </div>
            </div>
            :
            <div>Добавлять ассортимент разрешено только зарегистрированным менеджерам/владельцам баров
                <section className="add-item">
                    <form onSubmit={this.handleBarFormSubmit}>
                        <input type="text" name="barTitle" placeholder="Название бара" onChange={this.handleChange} value={this.state.barTitle} />
                        <input type="text" name="barAddress" placeholder="Адрес бара" onChange={this.handleChange} value={this.state.barAddress} />                    
                        <button>Добавить бар</button>
                    </form>
                </section> 
            </div>
        }
       
      </div>
    );
  }
}
export default App;