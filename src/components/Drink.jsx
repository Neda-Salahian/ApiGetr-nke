import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../App.css';

function Drink() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [error, setError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    const handleChange = (event) => {
        setSearchTerm(event.target.value); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchSearchResults();
    };

    const fetchSearchResults = async () => {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            setSearchResults(data.drinks || []); 
            setError(null); 

            console.log('Search results:', data.drinks);
        } catch (error) {
            console.error('Error fetching search results:', error.message);
            setError('Error fetching search results. Please try again later.'); 
            setSearchResults([]);
        }
    };

    const fetchCategoryResults = async (category) => {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
            if (!response.ok) {
                throw new Error('Failed to fetch category results');
            }
            const data = await response.json();
            setSearchResults(data.drinks || []); 
            setError(null); 

            console.log('Category results:', data.drinks);
        } catch (error) {
            console.error('Error fetching category results:', error.message);
            setError('Error fetching category results. Please try again later.');
            setSearchResults([]); 
        }
    };

    useEffect(() => {
        const fetchInitialResults = async () => {
            try {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`);
                if (!response.ok) {
                    throw new Error('Failed to fetch initial results');
                }
                const data = await response.json();
                setSearchResults(data.drinks || []); 
                setError(null); 
                setInitialLoad(false);

                console.log('Initial results:', data.drinks);
            } catch (error) {
                console.error('Error fetching initial results:', error.message);
                setError('Error fetching initial results. Please try again later.'); 
                setSearchResults([]); 
            }
        };

        if (initialLoad) {
            fetchInitialResults();
        }
    }, [initialLoad]);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <div>
                        <h2>Search for a Cocktail</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter cocktail name..."
                                value={searchTerm}
                                onChange={handleChange}
                            />
                            <Button variant="success" type="submit" className='mx-2 button-search'>Search</Button>
                        </form>
                    </div>
                </Row>

                <Row>
                    {error && <p>{error}</p>} 
                    {searchResults.length > 0 ? (
                        searchResults.map((drink, index) => (
                            <Col xs={12} md={6} lg={3} key={index}>
                                <Card style={{ width: '18rem' }} className="mb-3">
                                    <Card.Img variant="top" src={`${drink.strDrinkThumb}/preview`} alt={drink.strDrink} />
                                    <Card.Body>
                                        <Card.Title>{drink.strDrink}</Card.Title>
                                        <Card.Text>
                                            Category: <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => fetchCategoryResults(drink.strCategory)}>{drink.strCategory}</span>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        !error && <p>No results found.</p>
                    )}
                </Row>
            </Container>
        </>
    );
}

export default Drink;
