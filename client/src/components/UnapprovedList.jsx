import React, { useEffect, useState } from "react";
import RenderCoopList from "./RenderCoopList";

const { REACT_APP_PROXY } = process.env;

const UnapprovedList = () => {
    const [unapprovedCoops, setUnapprovedCoops] = React.useState([]);

    // While loading coop data unapproved list
    const [loadingCoopData, setLoadingCoopData] = React.useState(false);
    const [loadErrors, setLoadErrors] = React.useState("");

    const fetchUnapprovedCoops = async () => {
      setLoadingCoopData(true);
      
      try {
        const res = await fetch(REACT_APP_PROXY + `/coops/unapproved`);
        if (!res.ok) {
          throw Error("Cannot access unapproved coops.");
        }
        const response = await res.json();
        const initialUnapprovedCoops = response.map((coop) => {
          return coop;
        });
  
        setUnapprovedCoops(initialUnapprovedCoops);

      } catch (error) {
        console.error(error);
        setLoadErrors(`Error: ${error.message}`);
      } finally {
        setLoadingCoopData(false);
      }
    };
    

    useEffect(() => {
      fetchUnapprovedCoops();
    }, []);
        
    return (
        <>
            {loadErrors && (
              <strong className="form__error-message">
                {JSON.stringify(loadErrors)}
              </strong>
            )}

            {loadingCoopData && <strong>Loading unapproved coops...</strong>}

            <RenderCoopList link={"/approve-coop/"} searchResults={unapprovedCoops}  columnOneText={"Unapproved Entities"} columnTwoText={"Review"} />
        </>
    )
}

export default UnapprovedList;
