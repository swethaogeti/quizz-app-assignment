"use client";

import { GetServerSideProps, } from "next";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { dehydrate, DehydratedState, QueryClient } from "react-query";
import styled from "styled-components";
import dynamic from 'next/dynamic';
import Link from "next/link";

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });
const AnswerContainer = styled.div`
  background-color:#AF9CF3;
  height: 100%;
  width: 100%;
  
 .header-nav {
  background-image: url('/background.png'); 
  background-size: cover; 
  background-position: center;
  background-repeat: no-repeat; 
  height: 100px; 
  width: 100%; 
  position: relative;
}

.result-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem;
  height: 70%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  flex-direction: column;

  .status-container{
   display: flex;
   gap: 20px;
   flex-direction: column;
  }

  .correct-status{
    background-color: #e6ffe6;
    width: 400px;
    height: 50px;
   
    border-radius: 4px;  
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 0 10px;
  }
  .incorrect-status{
    background-color: #FFCCCC;
    width: 400px;
    height: 50px;
    border-radius: 4px;  
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 0 10px;
  }

  @media (max-width: 500px) {
  .correct-status{
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .incorrect-status{
    width: 100%;
    height: 100%;
    padding: 10px;
  }
 }
  .status-title{
  font-size: 18px;
  font-weight: 600;
 color: #9a9a9a;
  text-align: left;

  }
  
  }



.gauge-container{
  width: 300px;
  height: 130px;
}

.link-btn{
  width: 200px;
  height: 55px;
  background-color: #FF3B3C;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Poppins;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
 }

 @media (max-width: 600px) {
  .link-btn{
    width: 100%;
    height: 50px;
  }
 }
 .correct-dot{
  width: 14px;
  height: 14px;
  background-color: green;
  border-radius: 100%;
 }

 .incorrect-dot{
  width: 14px;
  height: 14px;
  background-color: #FF3B3C;;
  border-radius: 100%;
 }

 
`;


type Question = {
  id: string;
  question: string;
  answer: string;
};

const Result = ({ dehydratedState }: { dehydratedState: DehydratedState }) => {
  const {
    queries: [state],
  } = dehydratedState;
  const { state: currentState } = state;
  const { data: currentData } = currentState as { data: Question[] };
  const [answerDb, setAnswersDb] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const data: any | undefined = localStorage.getItem("answers");
    setAnswersDb(JSON.parse(data));
  }, []);


  function calculateResults(data : any , userAnswers: any) {
    let correct = 0;
    let wrong = 0;

    data.forEach((question:any, index:any) => {
      const correctAnswer = question.answer;
      const userAnswer = parseInt(userAnswers[index]);

      if (userAnswer === correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong };
  }


  const result = calculateResults(currentData, answerDb);

  const totalQuestions = result?.correct + result?.wrong;

  const percentage = (result?.correct / totalQuestions);
  console.log(percentage, 'dgj');
  return (
    <AnswerContainer>
      <div className="header-nav">
      </div>
      <div className="result-container">
        <h1>Your result</h1>
        <div className="gauge-container">
          {/* Define a linear gradient */}
      <svg width="0" height="0">
     
      <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF0000', stopOpacity: 1 }} /> {/* Red */}
            <stop offset="50%" style={{ stopColor: '#FFFF00', stopOpacity: 1 }} /> {/* Yellow */}
            <stop offset="100%" style={{ stopColor: '#00FF00', stopOpacity: 1 }} /> {/* Green */}
          </linearGradient>
        </defs>
        
      </svg>
          <GaugeChart
            id="gauge-chart3"
            nrOfLevels={1} // Adjust levels for rainbow effect
            colors={['url(#gradient)']} // Apply the gradient color
            arcWidth={0.1}
            percent={percentage}
            textColor={'black'}
            needleColor="#c6c0c9"
          />
        </div>
        <div className="status-container">
          <div className="correct-status">
            <div className="correct-dot">
            </div>
           <p className="status-title"> {result && result.correct}</p>
            <h3 className="status-title">
              Correct
            </h3>
          </div>
          <div className="incorrect-status">
            <div className="incorrect-dot">

            </div>
           <p className="status-title"> {result && result.wrong}</p>
            <h3 className="status-title">
              Incorrect
            </h3>
          </div>
        </div>
        <Link
          href="/"
          className="link-btn"
        >
          Start Again
        </Link>
      </div>
    </AnswerContainer>
  );
};

export default Result;

const fetchQuestionData = async (): Promise<Question[]> => {
  const res = await fetch(process.env.NEXT_PUBLIC_QUESTIONS_PATH as string);
  const data = await res.json();
  return data;
};
export const getServerSideProps: GetServerSideProps = async (Context) => {
  const queryClient = new QueryClient();
  await queryClient.fetchQuery(["questionData"], fetchQuestionData);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
