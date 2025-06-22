import { RDSDataService } from '@aws-sdk/client-rds-data';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// AWS Configuration
const awsConfig = {
  region: process.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  }
};

// Aurora DSQL Configuration
const auroraConfig = {
  resourceArn: process.env.VITE_AURORA_RESOURCE_ARN || '',
  secretArn: process.env.VITE_AURORA_SECRET_ARN || '',
  database: process.env.VITE_AURORA_DATABASE || 'forgetrain',
  schema: process.env.VITE_AURORA_SCHEMA || 'public'
};

// S3 Configuration
const s3Config = {
  bucketName: process.env.VITE_S3_BUCKET_NAME || 'forgetrain-storage',
  region: process.env.VITE_AWS_REGION || 'us-east-1'
};

// Initialize AWS clients
export const rdsDataService = new RDSDataService(awsConfig);
export const s3Client = new S3Client(awsConfig);

// Database operations
export class AuroraDB {
  private static async executeStatement(sql: string, parameters: any[] = []) {
    try {
      const response = await rdsDataService.executeStatement({
        resourceArn: auroraConfig.resourceArn,
        secretArn: auroraConfig.secretArn,
        database: auroraConfig.database,
        sql,
        parameters: parameters.map((param, index) => ({
          name: `param${index + 1}`,
          value: {
            stringValue: typeof param === 'string' ? param : JSON.stringify(param),
            longValue: typeof param === 'number' ? param : undefined,
            booleanValue: typeof param === 'boolean' ? param : undefined,
            isNull: param === null || param === undefined
          }
        }))
      });
      return response;
    } catch (error) {
      console.error('Aurora DSQL Error:', error);
      throw error;
    }
  }

  // Tutorial operations
  static async getTutorials() {
    const sql = `
      SELECT * FROM tutorials ORDER BY created_at DESC
    `;
    
    const response = await this.executeStatement(sql);
    
    if (!response.records) return [];
    
    return response.records.map(record => {
      const row = record.reduce((acc: any, field, index) => {
        const columnName = response.columnMetadata?.[index]?.name?.toLowerCase();
        if (columnName) {
          let value = field.stringValue || field.longValue || field.booleanValue;
          
          // Parse JSON fields
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
          
          acc[columnName] = value;
        }
        return acc;
      }, {});
      
      return {
        id: row.id,
        tutorialId: row.tutorial_id,
        topicId: row.topic_id,
        title: row.title,
        subtitle: row.subtitle,
        coverImageUrl: row.cover_image_url,
        altText: row.alt_text,
        estimatedTimeMins: row.estimated_time_mins,
        readingLevel: row.reading_level,
        preferredLearningStyle: row.preferred_learning_style || [],
        storyContext: row.story_context,
        learningObjectives: row.learning_objectives || [],
        prerequisites: row.prerequisites || [],
        biteSizeSections: row.bite_size_sections || [],
        keyTakeaways: row.key_takeaways || [],
        funFact: row.fun_fact,
        reflectionPrompt: row.reflection_prompt,
        discussionThreadUrl: row.discussion_thread_url,
        progressBadge: row.progress_badge,
        xpPoints: row.xp_points,
        streakMultiplier: row.streak_multiplier,
        milestoneBadges: row.milestone_badges || [],
        spacedRepetitionId: row.spaced_repetition_id,
        nextTutorialId: row.next_tutorial_id,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
        body: row.body,
        metaDescription: row.meta_description,
        category: row.category,
        tags: row.tags || [],
        status: row.status,
        publishDate: row.publish_date ? new Date(row.publish_date) : undefined,
        introduction: row.introduction,
        conclusion: row.conclusion,
        images: row.images || [],
        diagrams: row.diagrams || [],
        downloadableAssets: row.downloadable_assets || [],
        codeSnippets: row.code_snippets || [],
        slug: row.slug,
        estimatedReadTime: row.estimated_read_time,
        filledSummary: row.filled_summary,
        builtInPoints: row.built_in_points || []
      };
    });
  }

  static async getTutorialById(id: string) {
    const sql = `
      SELECT * FROM tutorials WHERE id = ?
    `;
    
    const response = await this.executeStatement(sql, [id]);
    
    if (!response.records || response.records.length === 0) {
      return null;
    }
    
    const record = response.records[0];
    const row = record.reduce((acc: any, field, index) => {
      const columnName = response.columnMetadata?.[index]?.name?.toLowerCase();
      if (columnName) {
        let value = field.stringValue || field.longValue || field.booleanValue;
        
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        acc[columnName] = value;
      }
      return acc;
    }, {});
    
    return {
      id: row.id,
      tutorialId: row.tutorial_id,
      topicId: row.topic_id,
      title: row.title,
      subtitle: row.subtitle,
      coverImageUrl: row.cover_image_url,
      altText: row.alt_text,
      estimatedTimeMins: row.estimated_time_mins,
      readingLevel: row.reading_level,
      preferredLearningStyle: row.preferred_learning_style || [],
      storyContext: row.story_context,
      learningObjectives: row.learning_objectives || [],
      prerequisites: row.prerequisites || [],
      biteSizeSections: row.bite_size_sections || [],
      keyTakeaways: row.key_takeaways || [],
      funFact: row.fun_fact,
      reflectionPrompt: row.reflection_prompt,
      discussionThreadUrl: row.discussion_thread_url,
      progressBadge: row.progress_badge,
      xpPoints: row.xp_points,
      streakMultiplier: row.streak_multiplier,
      milestoneBadges: row.milestone_badges || [],
      spacedRepetitionId: row.spaced_repetition_id,
      nextTutorialId: row.next_tutorial_id,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
      body: row.body,
      metaDescription: row.meta_description,
      category: row.category,
      tags: row.tags || [],
      status: row.status,
      publishDate: row.publish_date ? new Date(row.publish_date) : undefined,
      introduction: row.introduction,
      conclusion: row.conclusion,
      images: row.images || [],
      diagrams: row.diagrams || [],
      downloadableAssets: row.downloadable_assets || [],
      codeSnippets: row.code_snippets || [],
      slug: row.slug,
      estimatedReadTime: row.estimated_read_time,
      filledSummary: row.filled_summary,
      builtInPoints: row.built_in_points || []
    };
  }

  static async createTutorial(tutorial: any) {
    const sql = `
      INSERT INTO tutorials (
        id, tutorial_id, topic_id, title, subtitle, cover_image_url, alt_text,
        estimated_time_mins, reading_level, preferred_learning_style,
        story_context, learning_objectives, prerequisites, bite_size_sections,
        key_takeaways, fun_fact, reflection_prompt, discussion_thread_url,
        progress_badge, xp_points, streak_multiplier, milestone_badges,
        spaced_repetition_id, next_tutorial_id, created_at, updated_at,
        body, meta_description, category, tags, status, publish_date,
        introduction, conclusion, images, diagrams, downloadable_assets,
        code_snippets, slug, estimated_read_time, filled_summary, built_in_points
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
    
    const parameters = [
      tutorial.id,
      tutorial.tutorialId,
      tutorial.topicId,
      tutorial.title,
      tutorial.subtitle,
      tutorial.coverImageUrl,
      tutorial.altText,
      tutorial.estimatedTimeMins,
      tutorial.readingLevel,
      JSON.stringify(tutorial.preferredLearningStyle || []),
      tutorial.storyContext,
      JSON.stringify(tutorial.learningObjectives || []),
      JSON.stringify(tutorial.prerequisites || []),
      JSON.stringify(tutorial.biteSizeSections || []),
      JSON.stringify(tutorial.keyTakeaways || []),
      tutorial.funFact,
      tutorial.reflectionPrompt,
      tutorial.discussionThreadUrl,
      tutorial.progressBadge,
      tutorial.xpPoints,
      tutorial.streakMultiplier,
      JSON.stringify(tutorial.milestoneBadges || []),
      tutorial.spacedRepetitionId,
      tutorial.nextTutorialId,
      tutorial.createdAt?.toISOString() || new Date().toISOString(),
      tutorial.updatedAt?.toISOString() || new Date().toISOString(),
      tutorial.body,
      tutorial.metaDescription,
      tutorial.category,
      JSON.stringify(tutorial.tags || []),
      tutorial.status,
      tutorial.publishDate?.toISOString(),
      tutorial.introduction,
      tutorial.conclusion,
      JSON.stringify(tutorial.images || []),
      JSON.stringify(tutorial.diagrams || []),
      JSON.stringify(tutorial.downloadableAssets || []),
      JSON.stringify(tutorial.codeSnippets || []),
      tutorial.slug,
      tutorial.estimatedReadTime,
      tutorial.filledSummary,
      JSON.stringify(tutorial.builtInPoints || [])
    ];
    
    return await this.executeStatement(sql, parameters);
  }

  static async updateTutorial(tutorial: any) {
    const sql = `
      UPDATE tutorials SET
        tutorial_id = ?, topic_id = ?, title = ?, subtitle = ?, cover_image_url = ?, alt_text = ?,
        estimated_time_mins = ?, reading_level = ?, preferred_learning_style = ?,
        story_context = ?, learning_objectives = ?, prerequisites = ?, bite_size_sections = ?,
        key_takeaways = ?, fun_fact = ?, reflection_prompt = ?, discussion_thread_url = ?,
        progress_badge = ?, xp_points = ?, streak_multiplier = ?, milestone_badges = ?,
        spaced_repetition_id = ?, next_tutorial_id = ?, updated_at = ?,
        body = ?, meta_description = ?, category = ?, tags = ?, status = ?, publish_date = ?,
        introduction = ?, conclusion = ?, images = ?, diagrams = ?, downloadable_assets = ?,
        code_snippets = ?, slug = ?, estimated_read_time = ?, filled_summary = ?, built_in_points = ?
      WHERE id = ?
    `;
    
    const parameters = [
      tutorial.tutorialId,
      tutorial.topicId,
      tutorial.title,
      tutorial.subtitle,
      tutorial.coverImageUrl,
      tutorial.altText,
      tutorial.estimatedTimeMins,
      tutorial.readingLevel,
      JSON.stringify(tutorial.preferredLearningStyle || []),
      tutorial.storyContext,
      JSON.stringify(tutorial.learningObjectives || []),
      JSON.stringify(tutorial.prerequisites || []),
      JSON.stringify(tutorial.biteSizeSections || []),
      JSON.stringify(tutorial.keyTakeaways || []),
      tutorial.funFact,
      tutorial.reflectionPrompt,
      tutorial.discussionThreadUrl,
      tutorial.progressBadge,
      tutorial.xpPoints,
      tutorial.streakMultiplier,
      JSON.stringify(tutorial.milestoneBadges || []),
      tutorial.spacedRepetitionId,
      tutorial.nextTutorialId,
      new Date().toISOString(),
      tutorial.body,
      tutorial.metaDescription,
      tutorial.category,
      JSON.stringify(tutorial.tags || []),
      tutorial.status,
      tutorial.publishDate?.toISOString(),
      tutorial.introduction,
      tutorial.conclusion,
      JSON.stringify(tutorial.images || []),
      JSON.stringify(tutorial.diagrams || []),
      JSON.stringify(tutorial.downloadableAssets || []),
      JSON.stringify(tutorial.codeSnippets || []),
      tutorial.slug,
      tutorial.estimatedReadTime,
      tutorial.filledSummary,
      JSON.stringify(tutorial.builtInPoints || []),
      tutorial.id
    ];
    
    return await this.executeStatement(sql, parameters);
  }

  static async deleteTutorial(id: string) {
    const sql = `DELETE FROM tutorials WHERE id = ?`;
    return await this.executeStatement(sql, [id]);
  }
}

// S3 operations
export class S3Storage {
  static async uploadFile(file: File, folder: string = 'tutorials'): Promise<string> {
    const key = `${folder}/${Date.now()}_${file.name}`;
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: s3Config.bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read'
      }));
      
      return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  static async deleteFile(url: string): Promise<void> {
    try {
      const key = url.split('.com/')[1];
      await s3Client.send(new DeleteObjectCommand({
        Bucket: s3Config.bucketName,
        Key: key
      }));
    } catch (error) {
      console.error('S3 delete error:', error);
      throw error;
    }
  }
}

// Export the main database and storage instances
export const db = AuroraDB;
export const storage = S3Storage; 