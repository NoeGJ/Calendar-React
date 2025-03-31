

export const formatBytes = ( size = 0) => {
    const fileType = ['B', 'KB', 'MB'];
    const t = 1024;

    const idx = Math.floor( Math.log( size ) / Math.log( t ) );

    return `${ parseFloat(( size / Math.pow( t, idx )).toFixed( 2 ))} ${ fileType[ idx ]? fileType[ idx ]: '--'  }`
}
