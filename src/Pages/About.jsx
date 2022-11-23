import Header from '../Components/Header';
import Searchbar from '../Components/Searchbar';

export default function About(){
    return (
        <>
            <h2 style={{textAlign: 'center', color:'white', margin:100}}>
                This project was done in a short period and may still use so many improvements.. if you wanna add some functionality please see the github repository, fork, change, and create a pull request! 
            </h2>
            <div style={{width: '70%', margin: 'auto auto auto auto'}}>
                <Searchbar/>
            </div>
        </>
    )
}