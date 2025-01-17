import React from "react";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPokemons, filterTypePokemon, filterByCreation, filterAlphabetic, filterByAttack, filterByDefense, getPokemonByName, cleanPokemonsHome } from "../../redux/actions";
import NavBar from "../NavBar/NavBar";
import PokemonCard from "../PokemonCard/PokemonCard";
import "./Home.css"
import Pagination from "../Pagination/Pagination";
import Footer from "../Footer/Footer";

export default function Home (){

    const dispatch = useDispatch();
    const allPokemons = useSelector((state) => state.pokemons);
    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonsPerPage, setPokemonsPerPage] = useState(12);
    const [order, setOrder] = useState("");
    const [name, setName] = useState("");
    const [pageNumberLimit, setPageNumberLimit] = useState(3);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(3);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [filterCall, setFilterCall] = useState(false);
    const [searchCall, setSearchCall] = useState(false);

    const lastPokemonIndex = currentPage * pokemonsPerPage;
    const firstPokemonIndex = lastPokemonIndex - pokemonsPerPage;
    const currentPokemons = allPokemons.slice(firstPokemonIndex, lastPokemonIndex);

    useEffect(()=>{
        dispatch(getAllPokemons());
        return function(){
            dispatch(cleanPokemonsHome())
        }
    },[]);

    function handleReloadPage(){
        dispatch(cleanPokemonsHome());
        setFilterCall(false);
        dispatch(getAllPokemons());
    }

    function handleFilterType(event){
        dispatch(filterTypePokemon(event.target.value));
        setCurrentPage(1);
        setFilterCall(true);
        setMaxPageNumberLimit(3);
        setMinPageNumberLimit(0);
    }

    function handleFilterAlphabetic(event){
        event.preventDefault();
        dispatch(filterAlphabetic(event.target.value))
        setCurrentPage(1);
        setOrder(`Order ${event.target.value}`);
    }

    function handleFilterAttack(event){
        event.preventDefault();
        dispatch(filterByAttack(event.target.value))
        setCurrentPage(1);
        setOrder(`Order ${event.target.value}`);
    }

    function handleFilterDefense(event){
        event.preventDefault();
        dispatch(filterByDefense(event.target.value))
        setCurrentPage(1);
        setOrder(`Order ${event.target.value}`);
    }

    function handleFilterCreation(event){
        dispatch(filterByCreation(event.target.value));
        setCurrentPage(1);
        setOrder(`Order ${event.target.value}`);
    }

    function handleSearchInput(event){
        event.preventDefault();
        setName(event.target.value);
    }

    function handleSearchButton(event){
        event.preventDefault();
        setSearchCall(true);
        try {
            if(name.length > 0){
                dispatch(cleanPokemonsHome());
                dispatch(getPokemonByName(name))
            } else alert("You can not find a Pokémon without name ;)");
        } catch (error) {
            if(allPokemons.length === 0){
                dispatch(getAllPokemons());
            }
        }
        setCurrentPage(1);
        setName("");
    }

    useEffect(()=>{
        if(allPokemons.length === 0 && filterCall){
            setFilterCall(false);
            alert(`There are no Pokémons with that type yet :(`);
            dispatch(filterTypePokemon("allTypes"));
            setCurrentPage(1);
            setMaxPageNumberLimit(3);
            setMinPageNumberLimit(0);
        }
        if(allPokemons.length === 0 && searchCall){
            setSearchCall(false);
            dispatch(getAllPokemons())
        }
    },[allPokemons])

    return (
        <div className="home">
            <NavBar
                handleFilterType={handleFilterType}
                handleReloadPage={handleReloadPage}
                handleFilterCreation={handleFilterCreation}
                handleFilterAlphabetic={handleFilterAlphabetic}
                handleFilterAttack={handleFilterAttack}
                handleFilterDefense={handleFilterDefense}
                handleSearchInput={handleSearchInput}
                handleSearchButton={handleSearchButton}
            />
            <div className="main">
            {
                currentPokemons.length > 0 && typeof currentPokemons === "object" ?
                    <div id="renderPokemons">
                        <div className="cardContainer">
                            {currentPokemons&&currentPokemons.map(pokemon => <PokemonCard
                                key={pokemon.id}
                                id={pokemon.id}
                                name={pokemon.name}
                                image={pokemon.image}
                                types={pokemon.types}
                            />)}
                        </div>
                        <div>
                            <Pagination
                                totalPokemons={allPokemons.length}
                                pokemonsPerPage={pokemonsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pageNumberLimit={pageNumberLimit}
                                maxPageNumberLimit={maxPageNumberLimit}
                                setMaxPageNumberLimit={setMaxPageNumberLimit}
                                minPageNumberLimit={minPageNumberLimit}
                                setMinPageNumberLimit={setMinPageNumberLimit}
                            />
                        </div>
                    </div> :
                        typeof currentPokemons === "object" ?
                        <img src="https://www.superiorlawncareusa.com/wp-content/uploads/2020/05/loading-gif-png-5.gif" alt="Loading gif" id="gif"/> :
                        <img src="https://media.tenor.com/wWiwC0p518wAAAAC/nothing-no.gif" alt="None gif" id="gifNone"/>
            }
            </div>
            <Footer/>
        </div>
    )
}