import { useState } from "react"
import toast from "react-hot-toast";

const SignUp = () => {

    const [data,setData]=useState({email:"",password:""});
    const [loading,setLoading]=useState(false);

    const submitHandler=async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(!data.email || !data.password)
        {
            toast.error("Enter both fields");
            return ;
        }
        else if(data.password.length<8)
        {
            toast.error("Password Length should be 8")
            return;
        }
        try{
            setLoading(true);

            const res= await fetch(`${import.meta.env.VITE_URL}/api/auth/signup`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(data),
            });
            console.log(res);

            const result=await res.json();

            if(!result.success)
            {
                throw new Error(result.msg);
            }
            
            toast.success(result.msg);

        }catch(err:any){
            toast.error(err.message || "signup failed");
        }finally{
            setLoading(false);
        }
        
        
    }

  return (
    <div className="h-screen justify-center items-center flex w-screen">
        <div className="flex flex-col justify-center items-center bg-[#1c1b1b] p-5 py-15 rounded-md">
            <h1 className="mb-8 font-semibold text-xl">Kuldeep's Jargon</h1>
            <form className="flex flex-col gap-3 rounded-md" onSubmit={submitHandler}>
                <input 
                    type="email"
                    className="border rounded-md"
                    name="email"
                    value={data.email}
                    onChange={(e)=>setData((prev)=>({...prev,[e.target.name]:e.target.value}))}
                />
                <input 
                    type="password"
                    className="border rounded-md"
                    name="password"
                    value={data.password}
                    onChange={(e)=>setData((prev)=>({...prev,[e.target.name]:e.target.value}))}
                />
                <button 
                    className="border rounded-md"
                    type="submit"
                    disabled={loading}
                >Sign Up</button>
            </form>
        </div>
    </div>
  )
}

export default SignUp