import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function checkUserIdExists(userId) {
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('user_id', userId)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    return data.length > 0; 
  } catch (error) {
    console.error('Error checking user ID:', error);
    return false;
  }
}

// Function to add a new company in the companies table with the admin userID
export async function addCompany(companyName,companyUrl,adminId,adminEmail,serviceToken,path) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([{ name: companyName, company_url:companyUrl,admin_id: adminId,admin_email:adminEmail,onepassword_service_token:serviceToken,onepassword_path:path }]);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data; 
  } catch (error) {
    console.error('Error adding company:', error);
    return null;
  }
}

// Function to add the user by first finding the company id for the user's company
export async function getCompanyIdByName(companyName,userId) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('name', companyName)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.id; 
  } catch (error) {
    console.error('Error retrieving company ID:', error);
    return null;
  }
}

export async function getUniqueCompanyCode(companyName) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('company_code')
      .eq('name', companyName)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.company_code; 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAuthToken(userID) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('auth_token')
      .eq('user_id', userID)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.auth_token; 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompanyServiceToken(companyName) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('onepassword_service_token')
      .eq('name', companyName)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.onepassword_service_token; 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserEmail(userID) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_email')
      .eq('user_id', userID)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.user_email; 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function isAdmin(companyName,userID) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('admin_id')
      .eq('name', companyName)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return (userID === data[0]?.admin_id); 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getOnePasswordPath(companyName) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('onepassword_path')
      .eq('name', companyName)
      .limit(1);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data[0]?.onepassword_path; 
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCurrentUserCompany(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('company_id')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      throw new Error(error.message);
    }
    
    const companyId = data.company_id

    const { data : companiesData, error : companyError } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

      if (companyError) {
        throw new Error(error.message);
      }

      return companiesData.name

  } catch (error) {
    console.error(error);
    return null;
  }
}

// After getting the companyId, add the user in the users table
export async function addUser(companyName, userId,userEmail,authToken) {
  try {
    const companyId = await getCompanyIdByName(companyName,userId);
    
    if (!companyId) {
      throw new Error('Company not found');
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ company_id: companyId, user_id: userId,user_email:userEmail,auth_token:authToken }]);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return data; 
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
}

export async function getCompaniesList() {
  const { data, error } = await supabase
    .from('companies')
    .select('name');

  if (error) {
    console.error(error);
    return [];
  }

  const companiesList = data.map((company) => company.name);

  return companiesList;
}

export async function getUniqueCode(companyName){
  const { data, error } = await supabase
      .from('companies')
      .select('company_code')
      .eq('name', companyName)
      .single();

    if (error) {
      console.error('Error retrieving company code:', error);
      return;
    }

    return data.company_code
}

export async function getResources(companyName){
  const { data, error } = await supabase
    .from('companies')
    .select('resources')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const resources = data.resources;

  return resources

}

export async function addResource(companyName,resource){
  const { data, error } = await supabase
    .from('companies')
    .select('resources')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  let resources = data.resources;

  if(resources===null){
    resources = [resource]
  }else{
    resources.push(resource)
  }

  const { error: updateError } = await supabase
    .from('companies')
    .update({ resources })
    .eq('name', companyName);

  if (updateError) {
    console.error(updateError);
    return;
  }

}

export async function getGuides(companyName){
  const { data, error } = await supabase
    .from('companies')
    .select('guides')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const guides = data.guides;

  return guides
}

export async function addGuide(companyName,guide){
  const { data, error } = await supabase
    .from('companies')
    .select('guides')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  let guides = data.guides;

  if(guides===null){
    guides = [guide]
  }else{
    guides.push(guide)
  }

  const { error: updateError } = await supabase
    .from('companies')
    .update({ guides })
    .eq('name', companyName);

  if (updateError) {
    console.error(updateError);
    return;
  }

}

export async function getSnippets(companyName){
  const { data, error } = await supabase
    .from('companies')
    .select('snippets')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const snippets = data.snippets;

  return snippets
  
}

export async function addSnippet(companyName,snippet){
  const { data, error } = await supabase
    .from('companies')
    .select('snippets')
    .eq('name', companyName)
    .single();

  if (error) {
    console.error('Error:', error);
    return null;
  }

  let snippets = data.snippets;
  
  if(snippets===null){
    snippets = [snippet]
  }else{
    snippets.push(snippet)
  }

  const { error: updateError } = await supabase
    .from('companies')
    .update({ snippets })
    .eq('name', companyName);

  if (updateError) {
    console.error(updateError);
    return;
  }

}