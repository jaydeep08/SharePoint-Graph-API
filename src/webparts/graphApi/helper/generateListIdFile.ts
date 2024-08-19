import { GraphHelper } from './helper';

export const createListFile = () => {
  const helper = new GraphHelper();

  const handleGenerateFile = async () => {
    try {
      const listRes = await helper.getAllLists();

      const listData = {};
      let Data = "export const listData={";
      listRes.value.forEach((list) => {
        listData[list.displayName] = list.id;
        Data += `${list.displayName.replace(/\s+/g, '')}:${list.id},\n`;
      });

      Data += "}";
      const blob = new Blob([Data], { type: 'text/plain' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'listData.ts');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  handleGenerateFile().then(() => { console.log('this will succeed') }).catch((error) => { console.log(error) });
}
