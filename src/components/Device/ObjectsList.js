import _ from "lodash";
import React from "react";
import Masonry from 'react-masonry-component';
import ObjectCard from './ObjectCard';

const masonryOptions = {
    transitionDuration: 500
};

function renderList(objects) {
    return _.map(objects, (object, i) => {
        return (
          <div className="object-grid-item" key={i}>
              <ObjectCard object={object}/>
          </div>

        );
    });
}

export default props => {
        return (
          <div>
              <Masonry
                className={''} // default ''
                elementType={'div'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
              >
                  {/*object to render in the tab content*/}
                  {renderList(props.objects)}
              </Masonry>
          </div>
        );
}

