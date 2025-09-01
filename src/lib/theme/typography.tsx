import styled from "styled-components";
import colors from "./colors";

export const StyledTitle = styled.h1<{ $textColor?: string }>`
font-size: 30px;
color: ${props => props.$textColor ?? colors.black};
font-family: "Ubuntu", sans-serif;
font-weight: bold;
`;

export const StyledSubTitle = styled.h1<{ $textColor?: string }>`
padding: 5px 0 0 15px;
font-size: 24px;
color: ${props => props.$textColor ?? colors.black};
font-family: "Ubuntu", sans-serif;
font-weight: bold;
`;

export const StyledMenuItem = styled.button<{ $textColor?: string, $backgroundColor?: string }>`
font-size: 20px;
padding: 10px 17px;
margin-bottom: 8px;
width: 100%;
max-lines: 1;
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
background-color: ${props => props.$backgroundColor};
border-radius: 8px;
color: ${props => props.$textColor ?? colors.black};
font-weight: 500;
transition: background-color 700ms ease, color 700ms ease;
border: none;
cursor: pointer;
text-align: left;
`;

export const StyledDefaultText = styled.p<{ $textColor?: string }>`
font-size: 14px;
color: ${props => props.$textColor ?? colors.black};
font-weight: 400;
`;

export const StyledTablePlaceholder = styled.p<{ $textColor?: string }>`
font-size: 18px;
color: ${props => props.$textColor ?? colors.thinGray};
font-weight: 400;
`;

export const StyledTableHeader = styled.p`
font-size: 12px;
text-transform: uppercase;
color: ${colors.thinGray};
font-weight: bold;
`;
