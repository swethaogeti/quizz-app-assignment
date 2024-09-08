"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  dehydrate,
  DehydratedState,
  QueryClient,
} from "react-query";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import 'react-circular-progressbar/dist/styles.css';
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import 'react-circular-progressbar/dist/styles.css'; 
const QuestionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction:column;
  background-color: #AF9CF3;
  padding: 20px;
  height: 100%;

 .header-nav {
  background-image: url('/background.png'); 
  background-size: cover; 
  background-position: center;
  background-repeat: no-repeat; 
  height: 100px; 
  width: 100%; 
  position: relative;
 
  
}

.circular-progress-container{
    height: 150px;
    width: 150px;
    position: absolute;
    top:0;
    left: 45%;
    background-color: white;
    border-radius: 100%;
    padding: 10px;

}

@media (max-width: 480px) {
  .circular-progress-container{
    height: 100px;
    width: 100px;
    top:50%;
    left: 35%;
  }
}
`;

const QuestionDiv = styled.div`
 background-color: white;
 height: 100%;
 width: 100%;
 border-radius: 30px;
 display: flex;
 align-items: center;
 padding: 40px 40px 40px 40px;
 justify-content: flex-start;
 flex-direction: column;

.option-image-container{
  width: 400px;
  height: 200px;
 
}
.image{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.question-title{
  font-size: 32px;
  font-weight: 900;
  text-align: left;
  margin-bottom: 20px;
  text-align: start;
  margin-top: 10px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  grid-template-rows: repeat(2, auto); 
  gap: 16px; 
  margin: 20px 0;
}
@media (max-width: 600px) { 
  .options-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto); 
  }
}


.radio-input {
  opacity: 0;
  position: absolute;
}


.option-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 500px;
  height: 80px;
  background-color: #F3F4FA;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  margin-bottom: 8px;
  border: 1px solid #ccc; 
}

@media (max-width: 480px) {

  .question-title{
    font-size: 24px;
    font-size: 500;
  }
  .option-div {
    width: 100%; 
    height: auto; 
 
  } 
}


.option-div::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid #ccc; 
  border-radius: 50%;
  box-sizing: border-box;
}

.option-text {
  margin: 0;
}


.option-div.selected {
  border-color: green;
}

.option-div.selected::before {
  background-color: green;
  border-color: green;
  position: relative;
}


.option-div.selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 14px; 
  transform: translateY(-50%);
  width: 8px; 
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.option-text{
font-size: 18px;
font-weight: 400;
margin-left: 5px;
text-align: left;

}

  button {
    background-color: #df006c;
    padding: 0.5rem;
    margin: 0.5rem 0;
    outline: none;
    border: 1px solid white;
    border-radius: 3px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
  } 

  
`;



const ButtonsContainer = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: flex-end;

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

 .link-btn.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .link-btn{
    width: 300px;
  }
}


`;

type Question = {
  question: string;
  options: { id: number; text: string }[];
  answer: number;
  id: string;
  image?: string
};

type Data = Question;

const Question = ({ dehydratedData }: { dehydratedData: DehydratedState }) => {
  const router = useRouter();
  const { question} = router.query as { question: any};
  const [currrentData, setCurrentData] = useState<Data | undefined>();
  const [answerArray, setAnswerArray] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const {
    queries: [state],
  } = dehydratedData ?? { queries: [] };

  const { state: currentState } = state ?? { state: null };
  const { data: currentD } = (currentState ?? { data: [] }) as {
    data: Data[];
  };

  const getCurrentData = () => {
    return setCurrentData(currentD.find((item) => "" + item?.id === question));
  };

  useEffect(() => {
    getCurrentData();
  });

 
  const storeAnswerFunc = (id: number | any, selectedOption: string|any): void => {
    setAnswerArray((prev: string[]) => [...prev, selectedOption]);

    localStorage.setItem("answers", JSON.stringify([...answerArray, selectedOption]));

    setSelectedAnswer(null);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(e.target.value);
  };

  const percentageCompleted = (Number(question) / 6) * 100;

  return (
    <QuestionContainer>
      <div className="header-nav">
        <div className="circular-progress-container">
          <CircularProgressbar value={percentageCompleted}
            text={!selectedAnswer && Number(question) === 1
              ? `0/6`
              : selectedAnswer
              ? `${question}/6`
              : `${question-1}/6`}
            styles={buildStyles({
              pathColor: 'green',         
              textColor: '#000000',           
              trailColor: '#d6d6d6',     
                   
            })}
            
            />
        </div>

      </div>
      <QuestionDiv>
        <h1 className="question-title">
          {currrentData?.id}. {currrentData?.question}
        </h1>
        {currrentData?.image && <div className="option-image-container">
          <img src={currrentData?.image} alt="option-reference-image" className="image" />
        </div>}

        <form
          className="options-grid"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          {currrentData &&
            currrentData.options?.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`option-div ${
                    selectedAnswer === item.id.toString() ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedAnswer(item.id.toString())} 
                >
                  <input
                    type="radio"
                    name={`question-${currrentData?.id}`}
                    value={item.id}
                    checked={selectedAnswer === item.id.toString()}
                    onChange={handleOptionChange}
                    className="radio-input"

                  />
                  <p className="option-text">{item.text}</p>
                </div>
              );
            })}
        </form>
        <ButtonsContainer>
  {Number(question) > 5 ? (
    <Link
      passHref
      href="/result"
      className="link-btn"
    >
      End
    </Link>
  ) : (
    <div>
      <Link
        onClick={() => storeAnswerFunc(currrentData?.id, selectedAnswer)}
        className={`link-btn ${!selectedAnswer ? 'disabled' : ''}`}
        href="/questions/[question]"
        as={`/questions/${Number(currrentData?.id) + 1}`}
      >
        Next
      </Link>
    </div>
  )}
</ButtonsContainer>
      </QuestionDiv>
    </QuestionContainer>
  );
};


const fetchQuestion = async (): Promise<Data[]> => {
  const res = await fetch(process.env.NEXT_PUBLIC_QUESTIONS_PATH as string);
  const data = await res.json();
  return data;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["question"], fetchQuestion);
  return {
    props: {
      dehydratedData: dehydrate(queryClient),
    },
  };
};

export default Question;

