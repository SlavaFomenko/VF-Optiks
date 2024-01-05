// TabContent.js
import React, { ReactNode } from 'react';

interface TabContent{
	children:ReactNode
}

export const TabContent:React.FC<TabContent>= ({ children }):JSX.Element => {

	return(
		<>
			{children}
		</>
	)
};

