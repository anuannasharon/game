import './../App.css'
import { useState, useEffect } from 'react';
import { comb_3, win_3, comb_4,  win_4, comb_5,  win_5 } from './config';
import { toast } from 'react-toastify';
toast.configure({theme:'colored'})


function Board({size, userMaze, systemMaze}) {
  
  const [cells, setCells] = useState([]);
  const [systemTurn, setSystemTurn] = useState(false);
  const [timer, setTimer] = useState(60);
  const [over, setOver] = useState(false);
  const [combinations, setCombination] = useState({});
  const [winComb, setWinComb] = useState([]);
  const [counter, setCounter] = useState('')
  const t = {3: 60, 4: 120, 5: 180};


  useEffect(()=> {
     setOver(false);
     setSystemTurn(false);
     const row = new Array(size).fill('');
     const box = row.map(c=>{
      c = new Array(size).fill('')
      return c;
      });

     setCells(box);

     switch(size){
      case 3:
       setCombination(comb_3)
       setWinComb(win_3)
      break;
      case 4:
        setCombination(comb_4)
        setWinComb(win_4);
      break;
      case 4:
        setCombination(comb_5)
        setWinComb(win_5);
      break;
      default:
       setCombination(comb_3)
       setWinComb(win_3)
      break;
     }
     setTimer(t[size])
  },[size])

  useEffect(()=>{
    checkPlayedAll();
    if(systemTurn){
      pauseTimer()
    } else{
      resumeTimer()
    }
  },[systemTurn])

  useEffect(()=>{
    if(timer === 0){
      drawMatch()
    }
  },[timer]);


  const userPlay = (id) => {
    if (!over){
      const p = id.split('-');
      setCells(prev=>{
        prev[p[0]][p[1]] = userMaze;
        setSystemTurn(true)
        return [...prev]
      });

      let isWin = false;
      
      setTimeout(()=>{
        isWin = winCheck(userMaze)
        if(isWin) {
          setOver(true)
          toast.success('Congrats! You won.')
        }
      },500)
      
      setTimeout(()=>{
        if(!isWin){
          systemPlay(id)
        }
        
      },1000)
    }
  }

  const pauseTimer = () => {
    clearInterval(counter);
  }

  const resumeTimer = () => {
    clock();
  }

  const clock = () => {  
    clearInterval(counter);
    const c = setInterval(timerFn, 1000);
    setCounter(c);
  }

  const timerFn = () => {
     setTimer(prev=>{
        if(prev > 0) {
          return prev - 1;
        } else {
          clearInterval(counter);
          return 0;
        }
        
     })
  }

  const drawMatch = () => {
    setOver(true);
    toast.info('The match is draw')
  }

  const systemPlay = (userPlayId) => {
   if (!over){
     let systemPlayed = false;
     let systemWinProb = checkWinComb(systemMaze);
     let userwinProb = checkWinComb(userMaze);
     

      if (systemWinProb) {
        let d = systemWinProb.split('-')
        setCells(prev=>{
            prev[d[0]][d[1]] = systemMaze;
            return [...prev]
        });

        setTimeout(()=>{
          const isWin = winCheck(systemMaze)
          if(isWin) {
            setOver(true)
            toast.error('Computer Won.  Better luck next time')
          }
        },500)
        
      }
      else if (userwinProb) {
         let d = userwinProb.split('-')
         setCells(prev=>{
            prev[d[0]][d[1]] = systemMaze;
            return [...prev]
          })
      } else {
         combinations[userPlayId].forEach(d=>{
           if(cells[d[0]][d[1]] == '' && !systemPlayed) {

            setCells(prev=>{
              prev[d[0]][d[1]] = systemMaze;
              return [...prev]
            });

            systemPlayed = true;
          }
       })
      }
     setSystemTurn(false)
   }
  }

  const checkWinComb = (maze) => {
    let played = getAllPlays(maze);
    let out = winProbabily(played);
    let max = moreWinProbableIndex(out);
    let win = preventWin(max, played, maze);
    return win;
  }

  const getAllPlays = (maze) => {
    const played = [];
    cells.forEach((row,rowInx) => {
      row.forEach((col, colIndx) => {
        if (cells[rowInx][colIndx] === maze) {
          played.push(rowInx+'-'+colIndx)
        }
      });
    });
    return played;
  }

  const winProbabily = (palyed) => {
     let out = [];
     palyed.forEach(user => {
       winComb.map((each, idx) => {
         each.forEach(d => {
            if (user === d) {
             out.push(idx)
            }
         });
       })
    });
    return out;
  }

  const moreWinProbableIndex = (out) => {
    let max = [];

    out.map(c => {
      if (out.filter(d=>d === c).length >1) {
        max.push(c)
      }
    });

    return max;
  }

  const largeScore = (array) => {
      if(array.length == 0)
          return null;
      var modeMap = {};
      var maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++)
      {
          var el = array[i];
          if(modeMap[el] == null)
              modeMap[el] = 1;
          else
              modeMap[el]++;  
          if(modeMap[el] > maxCount)
          {
              maxEl = el;
              maxCount = modeMap[el];
          }
      }
      return {maxEl,maxCount};
  }

  const preventWin = (max, palyed, maze) => {
    let win = [];
    
    if (max.length) {
      max.map(d=> {
        winComb[d].map(c => {
          if (palyed.indexOf(c) === -1 && !checkAlreadyPlayed(c)) {
            win.push(c)
          }
        });
      });
    }
    console.log(win)
    const score = largeScore(win);
    console.log(score)

    if(maze === systemMaze) { 
     const count = (score && score.maxCount?score.maxCount: 0);
     return (count === (size-1)) ? score.maxEl : null;
    } else {
      return (score && score.maxEl) ? score.maxEl : null;
    }
    
  }

  const checkAlreadyPlayed = (cell) => {
    const d = cell.split('-');

    if (cells[d[0]][d[1]]){
      return true
    }

    return false;
  }

  const checkPlayedAll = () => {
    let playedAll = true;
    cells.forEach((row,rowInx) => {
      row.forEach((col, colIndx) => {
        if (cells[rowInx][colIndx] === '') {
          playedAll = false;
        }
      });
    });

    if (playedAll) {
      setOver(true);
      toast.info('The match is draw')
    }
  }
  
  const reMatch = () => {
    setOver(false);
    setSystemTurn(false)
    setTimer(t[size])
     cells.forEach((row,rowInx) => {
      row.forEach((col, colIndx) => {
        cells[rowInx][colIndx] = ''
      });
    });
  }

  const winCheck = (maze) => {
    let win = false
    const played = getAllPlays(maze)
    winComb.map(each=> {
     if (!win) {
        let p = 0
        played.map(c=>{
          if(each.indexOf(c)>-1){
             p+=1;
          }
        });

        if(p === size){
          win = true;
        }
     }
    });
    return win;
  } 

  return (
    <>
      <div className="d-flex justify-content-center">
      <div>
      {
        timer>0 && <h3>Timer: {timer} Sec.</h3>
      }

      {
        over ? <label>Game over <button className="btn btn-primary btn-sm mb-1" onClick={reMatch}>Remach</button></label>:<label>{ systemTurn  ? 'Computer Turn': 'Your Turn'}</label>
      }
      
      {
        cells.map((each,rowInx)=>(
          <div className={(systemTurn || over)? 'd-flex disabled':'d-flex'} >
           {
            each.map((c, colInx) => (
              <Cell key={rowInx+'-'+colInx} id={rowInx+'-'+colInx} value={c} userPlay={userPlay}></Cell>
            ))
           }
          </div>
        ))
      }
     </div>
     </div>
    </>
  );
}

const Cell = ({id, value, userPlay}) => {
  return(
   <div className={ value != '' ? 'border border-primary cell disabled' :'border border-primary cell' } onClick={()=>userPlay(id)}>
    {value}
   </div>
  )
}

export default Board;