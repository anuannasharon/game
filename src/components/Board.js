import './../App.css'
import { useState, useEffect } from 'react';
import { comb_3_x_3, win_3_x_3 } from './config';

function Board({size, userMaze, systemMaze}) {
  const row = new Array(size).fill('');
  let interval =''

  const box = row.map(c=>{
    c = new Array(size).fill('')
    return c;
  })
 
  const [cells, setCells] = useState(box);
  const [systemTurn, setSystemTurn] = useState(false);
  const [timer, setTimer] = useState(60);
  const [over, setOver] = useState(false)

  const userPlay = (id) => {
    checkPlayedAll();

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
          alert('Congrats! You won.')
        }
      },500)
      
      setTimeout(()=>{
        if(!isWin){
          systemPlay(id)
        }
        
      },1000)
    }
  }

  const systemPlay = (userPlayId) => {
   checkPlayedAll();

   if(!over){
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
          setOver(true)
          alert('System Won')
        },500)
        
      }
      else if (userwinProb) {
         let d = userwinProb.split('-')
         setCells(prev=>{
            prev[d[0]][d[1]] = systemMaze;
            return [...prev]
          })
      } else {
         comb_3_x_3[userPlayId].forEach(d=>{
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
    let win = preventWin(max, played);
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
       win_3_x_3.map((each, idx) => {
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
      if (out.filter(d=>d === c).length > 1) {
        max.push(c)
      }
    });
    return max;
  }

  const preventWin = (max, palyed) => {
     let win = []
     if (max.length) {
     max.map(d=> {
       win_3_x_3[d].map(c => {
        if (palyed.indexOf(c) === -1 && !checkAlreadyPlayed(c)) {
          win.push(c)
        }
      })
     })
    }
    return win[0];
  }

  const checkAlreadyPlayed = (cell) => {
    const d = cell.split('-')
    if(cells[d[0]][d[1]]){
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
    if(playedAll){
      setOver(true);
      alert('Draw Match')
    }
  }
  
  const reMatch = () => {
    setOver(false);
    setSystemTurn(false)
     cells.forEach((row,rowInx) => {
      row.forEach((col, colIndx) => {
        cells[rowInx][colIndx] = ''
      });
    });
  }

  const winCheck = (maze) => {
    let win = false
    const played = getAllPlays(maze)
    win_3_x_3.map(each=> {
     if(!win){
        let p = 0
        played.map(c=>{
          if(each.indexOf(c)>-1){
             p+=1;
          }
        });

        if(p === 3){
          win = true;
        }
     }
    });
    return win;
  } 

  return (
    <>
      {
        over ? <h4>Game over <button className="btn btn-primary" onClick={reMatch}>Remach</button></h4>:<h4>{ systemTurn  ? 'Computer Turn': 'Your Turn'}</h4>
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
    </>
  );
}

const Cell = ({id, value, userPlay}) => {
  return(
   <div className={ value != '' ? 'border border-primary cell text-center disabled' :'border border-primary cell text-center' } onClick={()=>userPlay(id)}>
    {value}
   </div>
  )
}

export default Board;