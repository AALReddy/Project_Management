import React, { useRef } from 'react'
import { IoMdCloseCircle } from 'react-icons/io';
import { apiFetch } from '../utils/api';
export default function EditPopup({ InputDiv, setInputDiv, task, onUpdated }) {
    let title=useRef()
    let desc=useRef()
async function handleClick(e)
{
    e.preventDefault()
    if (!task?._id) {
      return;
    }
    let formData={
        taskId: task._id,
        title:title.current.value,
        description:desc.current.value
      }
      await apiFetch('/api/v2/update-task', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setInputDiv(false);
      if (onUpdated) {
        await onUpdated();
      }
}
  return (
    <>
        {!InputDiv ? null : (
        <>
        <div className="fixed top-0 left-0 bg-gray-800 opacity-80 h-screen w-full"></div>
        <div className="modal-layer">
        <div className="modal-card">
            <div className="modal-header">
            <h2>Edit Task</h2>
            <button  onClick={()=>setInputDiv(false)} className="modal-close" type="button">
                <IoMdCloseCircle />
            </button>
            </div>
            <form className="modern-form">
            <input
                type="text"
                placeholder="Title"
                ref={title}
                defaultValue={task?.title || ""}
            />
            <textarea
                placeholder="Description"
                ref={desc}
                defaultValue={task?.description || ""}
            />
          
            <button onClick={handleClick} type="submit" className="primary-action">Submit</button>
            </form>
        </div>
        </div>
        </>
        )}
    </>
  )
}
