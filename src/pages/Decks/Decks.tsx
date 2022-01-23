import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {useAppSelector} from '../../redux/store';
import {
    deleteDeck,
    fetchCardsPacks,
    PacksInitialState,
    postDeck,
    setPrivateDecks,
    updateDeck
} from '../../redux/decks-reducer';
import {PacksPagination} from './PacksPagination/PacksPagination';
import s from './Decks.module.scss'
import {DecksTable} from './DecksTable/DecksTable';
import Spinner from '../../common/components/Spinner/Spinner';
import {BtnBlock} from './BtnBlock/BtnBlock';
import {Search} from '../../common/components/Search/Search';
import {Modal} from '../../common/components/Modal/Modal';
import {AddDeckForm} from './AddDeckForm/AddDeckForm';
import {useModal} from '../../common/hooks/useModal';
import {Sidebar} from './Sidebar/Sidebar';
import {AddItem} from './Sidebar/AddItem/AddItem';

export const Decks = React.memo(() => {
    const {isOpen, onToggle} = useModal()
    const dispatch = useDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const isLoading = useAppSelector<boolean>(state => state.app.isLoading)
    const userId = useAppSelector<string>(state => state.profile.profile._id)

    const {
        cardPacks,
        cardPacksTotalCount,
        minCardsCount,
        maxCardsCount,
        page,
        pageCount,
        privatePacks,
        sortBy,
        currentCardsCount,
        countPerPage,
        packName
    } = useAppSelector<PacksInitialState>(state => state.decks)

    const paginationScrollTopRef = useRef<HTMLHeadingElement>(null)

    const deleteDeckHandler = useCallback((id: string) => {
        dispatch(deleteDeck({id}));
    }, [dispatch]);

    const updateDeckHandler = useCallback((id: string, title: string) => {
        dispatch(updateDeck({cardsPack: {_id: id, name: title}}));
    }, [dispatch]);

    const showPrivate = useCallback((value: boolean) => {
        console.log(value)
        dispatch(setPrivateDecks(value))
    }, [dispatch])

    const addNewDeckHandler = useCallback((title: string) => {
        dispatch(postDeck({cardsPack: {name: title}}))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchCardsPacks())
    }, [dispatch, page, pageCount, currentCardsCount, privatePacks, sortBy, isLoggedIn,packName])

    useEffect(() => {
        paginationScrollTopRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [page, pageCount])

    if (!isLoggedIn) return <Navigate to={'/login'}/>
    return (
        <div className={s.decksWithSidebar}>
            <Sidebar/>
            <div className={s.decksContainer}>
                <h1 ref={paginationScrollTopRef}>Decks List</h1>
                {/*<h1 >Decks</h1>*/}
                {isLoading && <Spinner/>}
                <BtnBlock showPrivate={showPrivate} active={privatePacks} />
                <AddItem title='Add deck' setModal={onToggle}/>
                <Modal visible={isOpen} setVisible={onToggle}>
                    <AddDeckForm onSubmitHandler={addNewDeckHandler} isLoading={isLoading}/>
                </Modal>
                <Search/>
                <DecksTable decks={cardPacks}
                            deleteDeckHandler={deleteDeckHandler}
                            updateDeckHandler={updateDeckHandler}
                            userId={userId}/>
                <PacksPagination totalCount={cardPacksTotalCount}
                                 pageCount={pageCount}
                                 currentPage={page}
                                 countPerPage={countPerPage}/>
            </div>
        </div>
    )
})

