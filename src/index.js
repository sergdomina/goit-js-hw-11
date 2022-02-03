import './sass/main.scss';
import searchService from './js/API';
import itemsMarkup from './templates/itemsMarkup.hbs'
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const search=document.querySelector('#search-form')
const gallery=document.querySelector('.gallery')
const loadMoreBtnRef=document.querySelector('.load')

search.addEventListener('submit',handlSubmit)

async function handlSubmit(event){
    event.preventDefault()
    cleanImgContainer()
    searchService.resetPage()
    loadMoreBtn.hidden()

    const{elements:{search}}=event.currentTarget

    if(search.value.trim()===''){
        Notify.failure(`Введите валидное слово для поиска!`)
        return
    }
    searchService.query=search.value
    event.currentTarget.reset()
    try {
        const data=await searchService.searchImages()
        if (data.hits.length === 0) {
            Notify.warning('Картинок нет');
                  return;
        }
        Notify.success(`Супер! Найдено ${data.total} картинок`);
        loadMoreBtn.show()
        addItemsGallery(data.hits)
        
    } catch (error) {
        Notify.warning('что то пошло не так')
    }
}

function addItemsGallery(hits){
    gallery.insertAdjacentHTML('beforeend',itemsMarkup(hits))
    gallery.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
  
    const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt', 
      });
      lightbox.refresh();
}

const loadMoreBtn={
    enable(){
        loadMoreBtnRef.disabled=false;
        loadMoreBtnRef.textContent='load more'
        // loadMoreBtnRef.classList.add('is-hidden')
    },
    disabled(){
        loadMoreBtnRef.disabled=true;
        loadMoreBtnRef.textContent='loading...'
        // loadMoreBtnRef.classList.remove('is-hidden')
    },
    show(){
        loadMoreBtnRef.classList.remove('is-hidden')
    },
    hidden(){
        loadMoreBtnRef.classList.add('is-hidden')
    }
}

loadMoreBtnRef.addEventListener('click',fatchMoreImages)
async function fatchMoreImages(){
    loadMoreBtn.disabled()
    try {
        const data=await searchService.searchImages()
        addItemsGallery(data.hits)
        loadMoreBtn.enable()
    } catch (error) {
        Notify.warning('что то пошло не так')
    }
}
function cleanImgContainer(){
    gallery.innerHTML=''
}