import axios from "axios";

const KEY="4823621-792051e21e56534e6ae2e472f"
axios.defaults.baseURL='https://pixabay.com'
export default{
    searchQuery:"",
    page:1,
    async searchImages(){
    
        const url=`/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=40&key=${KEY}`
    const {data}=await axios.get(url)
    this.incrementPage()
        return data
    },
    resetPage(){
        this.page=1
    },
    incrementPage(){
        this.page+=1
    },
    get query(){
        return this.searchQuery
    },
    set query(value){
        this.searchQuery=value
    }
    
}