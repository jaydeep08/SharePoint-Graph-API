import * as React from 'react'
import GraphHelper from './helper/helper'

const App = () => {
    const helper = new GraphHelper();
    React.useEffect(()=>{
        const fun1 = async ()=>{
            try{
            const response = await helper.getListItems("43e49351-aac0-4dd6-9291-1b9e72563c7f","*")
            console.log(response);
            }catch(error){
                console.log("--------",error)
            }
        }
        fun1().then().catch(e=>{})
    },[])
  return (
    <div >App</div>
  )
}

export default App