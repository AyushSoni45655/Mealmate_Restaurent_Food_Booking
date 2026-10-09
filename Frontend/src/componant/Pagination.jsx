import {useDispatch, useSelector} from 'react-redux'; 
import { setPage } from '../redux(state managemant)/slices/product.slice';
export default function Pagination() {
  const dispatch = useDispatch();
 
     
  const {pagination,page,limit} = useSelector((state)=>state.product);
   const handleNextPage = ()=>{
    if(pagination.hasNextPage){
      dispatch(setPage((page)=>page + 1))
    }
  }
   const handlePrevPage = ()=>{
    if(pagination.handlePrevPage){
      dispatch(setPage((page)=>page - 1))
    }
  }
    return (
        <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium">
            <div onClick={handlePrevPage} type="button" aria-label="prev" className={`rounded-full ${pagination.hasPrevPage ? 'text-gray-500':'text-gray-50'} border border-slate-200 hover:bg-slate-100/70 active:scale-95 transition-all`}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
                </svg>
            </div>
        
            <span>Page {pagination.currentPage || 1} of {pagination.totalPages || 100}</span>
        
            <div onClick={handleNextPage} type="button" aria-label="next" className={`rounded-full ${pagination.hasNextPage ? 'text-gray-500':'text-gray-50'} border border-slate-200 hover:bg-slate-100/70 active:scale-95 transition-all`}>
                <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
                </svg>
            </div>
        </div>
    );
};