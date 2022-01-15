import Board from './components/Board';
import React, {useState, useCallback} from 'react';
import './App.css'
function App() {

  const [size, setSize] = useState(0);
  const [userMaze, setUsrMaze] = useState('X')
  const [systemMaze, setSystemMaze] = useState('O')
  
  const setMazeSize = (size) =>{
    setSize(Number(size))
  };

  const setUserMaze = (maze) => {
    setUsrMaze(maze);
    const options = ['O', "X"];
    setSystemMaze(options.filter(c=>c !== maze)[0])
  }


  return (
     <div className="row pt-2">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
             <div className="form-group">
              <label className="me-2 pb-1">Levels</label>
              <MazeOptions setMazeSize={setMazeSize}/>
            </div>
             <div class="form-group">
              <label className="me-2 pb-1">Choose Maze</label>
              <UserMaze setUserMaze={setUserMaze}/>
            </div>
          </div>
          <div className="card-body">
            {
              size != 0 ? <Board size="3" size={size} userMaze={userMaze} systemMaze={systemMaze}/>: <div>No Maze Selected</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const MazeOptions = ({setMazeSize}) => {

  const options = {
    0: 'Select Maze',
    3: '3X3',
    4: '4X4',
    5: '5X5'
  };

  return (
   <>
   <select className="form-select" onChange={(e)=>setMazeSize(e.target.value)}>
      {
        Object.keys(options).map((key, index)=>(
          <option value={key} key={index}>{options[key]}</option>
        ))
      }
    </select>
    </>
  )
}

const UserMaze = ({setUserMaze}) => {
  const options = ['X','O']
  return (
   <>
     <select className="form-select" onChange={(e)=>setUserMaze(e.target.value)}>
        {
          options.map((key, index)=>(
            <option value={key} key={index}>{key}</option>
          ))
        }
      </select>
    </>
  )
}

export default App;
